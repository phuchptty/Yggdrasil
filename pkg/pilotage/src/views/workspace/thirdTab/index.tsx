import getConfig from 'next/config';
import styles from './index.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import 'xterm/css/xterm.css';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { io, Socket } from 'socket.io-client';
import { Playground_Workspace } from '@/graphql/generated/types';
import { getLanguageByEditorKey } from '@/utils';
import Image from 'next/image';
import mobileLogin from '@/assets/images/mobile-login.svg';
import { Button, message } from 'antd';
import { addWorkspaceFile } from '@/stores/slices/workspaceFile.slice';
import { mergeArrays } from '@/utils/array';
import { LighthouseEvent } from '@/constants/lighthouseEvent';
import { RequestExecUrlResponse } from '@/types/lighthouseSocket.type';

type Props = {
    workspaceData: Playground_Workspace;
    accessToken: string;
    vmData: any;
    lightHouseSocket: Socket | undefined;
    isExecuting: boolean;
    setIsExecuting: (isExecuting: boolean) => void;
};

export default function WorkspaceThirdCol({ workspaceData, accessToken, isExecuting, setIsExecuting, vmData, lightHouseSocket }: Props) {
    const { publicRuntimeConfig } = getConfig();
    const { NEXT_PUBLIC_CODE_RUNNER_URL } = publicRuntimeConfig;

    const dispatch = useAppDispatch();
    const [messageApi, messageContext] = message.useMessage();

    const userData = useAppSelector((state) => state.authSlice.userData);
    const currentFile = useAppSelector((state) => state.workspaceFileSlice.currentFile);
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice.workspaceFiles);

    const terminalRef: any = useRef(null);
    const [terminal, setTerminal] = useState<any>();
    const [socket, setSocket] = useState<any>();

    // Exec url
    const [execUrl, setExecUrl] = useState<string>();

    useEffect(() => {
        if (!lightHouseSocket || !vmData) {
            return;
        }

        lightHouseSocket.emit(
            LighthouseEvent.REQUEST_EXEC_URL,
            {
                workspaceId: vmData.workspaceId,
                podName: vmData.podName,
            },
            (res: RequestExecUrlResponse) => {
                console.log(res);
                setExecUrl(res.execHost);
            },
        );
    }, [vmData, lightHouseSocket]);

    useEffect(() => {
        if (!socket || !workspaceData) {
            return;
        }

        if (terminal) {
            terminal.dispose();
        }

        const onDisconnect = () => {
            terminal?.write('\r\nDisconnected from server, reconnecting...');
            setIsExecuting(false);
        };

        const onConnect = async () => {
            const { Terminal } = await import('xterm');
            const { FitAddon } = await import('xterm-addon-fit');
            const term = new Terminal();
            const fitAddon = new FitAddon();

            setTerminal(term);

            term.loadAddon(fitAddon);
            term.open(terminalRef.current!);
            term.resize(12, 4);
            fitAddon.fit();

            term.writeln('Connected to server, waiting for action...');

            const xterm_resize_ob = new ResizeObserver(function (entries) {
                // since we are observing only a single element, so we access the first element in entries array
                try {
                    fitAddon && fitAddon.fit();
                } catch (err) {
                    console.log(err);
                }
            });

            // start observing for resize
            xterm_resize_ob.observe(terminalRef.current);

            // LISTEN for socket
            socket.timeout(60000).on('container-created', (containerId: string) => {
                term.clear();

                term.writeln(`[INFO] Container ID: ${containerId}`);

                term.onKey((e) => {
                    socket.emit(`input-${containerId}`, e.key);
                });

                // Listen to output
                socket.on(`output-${containerId}`, (data: string) => {
                    if (data !== '\u001bc') {
                        term.write(data);
                    }
                });
            });

            socket.on('container-deleted', (containerId: string) => {
                socket.removeAllListeners(`output-${containerId}`);
                setIsExecuting(false);
            });
        };

        socket.timeout(60000).on('connect', onConnect);

        return () => {
            terminal?.dispose();
            socket.off('disconnect', onDisconnect);
            socket.off('connect', onConnect);
        };
    }, [socket]);

    // useEffect(() => {
    //     if (!isExecuting) return;
    //
    //     const onRun = async () => {
    //         if (!socket || !workspaceData) {
    //             return;
    //         }
    //
    //         // Check diff file not loaded yet
    //         const notExistFiles = originalWorkspaceFiles?.filter((item) => !workspaceFiles?.find((item2) => item2.path === item.path));
    //
    //         if (notExistFiles && notExistFiles.length > 0) {
    //             try {
    //                 const { data: scatteredFilesData, error: scatteredFilesError } = await scatteredFilesQuery({
    //                     variables: {
    //                         workspaceId: workspaceData._id,
    //                         filePath: notExistFiles.map((item) => item.path),
    //                     },
    //                 });
    //
    //                 if (scatteredFilesError) {
    //                     console.error(scatteredFilesError);
    //                     messageApi.error('Lỗi khi tải file');
    //                 }
    //
    //                 if (scatteredFilesData) {
    //                     scatteredFilesData.playground_getScatteredWorkspaceFiles.forEach((item) => {
    //                         dispatch(addWorkspaceFile(item));
    //                     });
    //
    //                     const newArr = mergeArrays(workspaceFiles, scatteredFilesData.playground_getScatteredWorkspaceFiles);
    //
    //                     emitRun(newArr);
    //                 }
    //             } catch (e) {
    //                 console.error(e);
    //                 messageApi.error('Lỗi khi tải file');
    //             }
    //         } else {
    //             emitRun(workspaceFiles);
    //         }
    //     };
    //
    //     const emitRun = (files?: any[]) => {
    //         const langConfig = getLanguageByEditorKey(workspaceData.workspaceLanguage.editorKey);
    //
    //         const sendFiles = files?.map((item) => ({
    //             name: item.name,
    //             path: item.path,
    //             content: item.content,
    //         }));
    //
    //         socket.emit('run', {
    //             langId: workspaceData.workspaceLanguage.key,
    //             mainFile: langConfig?.entryFile || currentFile,
    //             codeFiles: sendFiles,
    //         });
    //     };
    //
    //     onRun();
    // }, [isExecuting]);

    return (
        <div>
            {messageContext}

            <div className={styles.columnHeader}>
                <p className={styles.columnTitle}>Shell</p>
            </div>

            <div className={styles.terminal}>
                {isLogin ? (
                    <div ref={terminalRef} id={'terminal'} className={styles.terminalContainer}></div>
                ) : (
                    <div className={styles.notLoginZone}>
                        <p className={styles.notLoginZoneTitle}>Bạn chưa đăng nhập</p>
                        <Image src={mobileLogin} alt="login moment" />

                        <Button type={'primary'} size={'large'}>
                            Đăng nhập ngay
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
