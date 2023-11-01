import getConfig from 'next/config';
import styles from './index.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import 'xterm/css/xterm.css';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { Socket } from 'socket.io-client';
import { Playground_Workspace } from '@/graphql/generated/types';
import { getLanguageByEditorKey } from '@/utils';
import Image from 'next/image';
import mobileLogin from '@/assets/images/mobile-login.svg';
import { Button, message } from 'antd';
import { mergeArrays } from '@/utils/array';
import { LighthouseEvent } from '@/constants/lighthouseEvent';
import { RequestExecUrlResponse } from '@/types/lighthouseSocket.type';
import dynamic from 'next/dynamic';
import { Terminal } from 'xterm';

const DynamicTerminal = dynamic(() => import('@/components/dynamicTerminal'), {
    ssr: false,
});

type Props = {
    workspaceData: Playground_Workspace;
    accessToken: string;
    vmData: any;
    lightHouseSocket: Socket | undefined;
    isExecuting: boolean;
    setIsExecuting: (isExecuting: boolean) => void;
};

const k8sProtocols = ['v4.channel.k8s.io', 'v3.channel.k8s.io', 'v2.channel.k8s.io', 'channel.k8s.io'];

export default function WorkspaceThirdCol({ workspaceData, accessToken, isExecuting, setIsExecuting, vmData, lightHouseSocket }: Props) {
    const dispatch = useAppDispatch();
    const [messageApi, messageContext] = message.useMessage();

    const userData = useAppSelector((state) => state.authSlice.userData);
    const currentFile = useAppSelector((state) => state.workspaceFileSlice.currentFile);
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice.workspaceFiles);

    const terminalRef: any = useRef(null);
    const [terminal, setTerminal] = useState<Terminal>();
    const [socket, setSocket] = useState<WebSocket>();

    // Exec url
    const [execUrl, setExecUrl] = useState<string>();

    useEffect(() => {
        console.log(lightHouseSocket, vmData);

        if (!lightHouseSocket || !vmData) {
            return;
        }

        // TODO: Disable until done dynamicTerminal
        lightHouseSocket.emit(
            LighthouseEvent.REQUEST_ATTACH_URL,
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
        if (!terminal) {
            return;
        }

        if (!execUrl) {
            return;
        }

        let socConn: WebSocket;
        let firstConnect = true;

        function sendMessage(msg: string, switchCode: number) {
            if (!socConn) return;

            const encoder = new TextEncoder();
            const data = encoder.encode(msg);

            const buffer = new Uint8Array(1 + data.byteLength);

            buffer[0] = switchCode;
            buffer.set(new Uint8Array(data.buffer), 1);

            socConn.send(buffer);
        }

        function socketConnect() {
            if (!terminal) return;

            let alive: number | undefined;
            let isSocketError = false;

            console.log(execUrl);

            socConn = new WebSocket(execUrl as string, k8sProtocols);
            socConn.binaryType = 'arraybuffer';

            socConn.onopen = function () {
                console.log('console connected');

                // Set socket to state
                setSocket(socConn);

                // Only send pre command on first connect
                if (firstConnect) {
                    // Ctrl C
                    // terminal.write('\x03');
                    socConn.send(new Uint8Array([0, 3]));

                    const preCommand = 'exec /bin/bash\n';
                    sendMessage(preCommand, 0);

                    const postCommand = 'clear\n';
                    sendMessage(postCommand, 0);

                    firstConnect = false;
                }

                // Send heartbeat to keep connection alive
                alive = window.setInterval(function () {
                    const buffer = new ArrayBuffer(1);
                    // @ts-ignore
                    buffer[0] = 0;

                    socConn.send(buffer);
                }, 10 * 1000);
            };

            socConn.onmessage = function (ev) {
                const data = ev.data;

                if (typeof data === 'string') {
                    terminal.write(data);
                } else if (data instanceof ArrayBuffer) {
                    // binary frame
                    const view = new DataView(data);
                    const switchCode = view.getUint8(0);

                    switch (switchCode) {
                        case 1:
                        case 2:
                        case 3:
                            const realData = data.slice(1);
                            const decoder = new TextDecoder('utf-8');
                            const text = decoder.decode(realData);

                            terminal.write(text);
                            break;
                    }
                }
            };

            socConn.onerror = function (e) {
                console.error(e);
                isSocketError = true;
            };

            socConn.onclose = function () {
                console.log('console disconnected. reconnecting...');

                // reconnect
                if (!isSocketError) {
                    setTimeout(() => {
                        socketConnect();
                    }, 500);
                }

                window.clearInterval(alive);
            };
        }

        // Connect to socket
        socketConnect();

        // Watch terminal input
        terminal.onData((data) => {
            sendMessage(data, 0);
        });

        return () => {
            terminal?.dispose();
            socConn.close();
        };
    }, [terminal, execUrl]);

    function sendStringCommand(msg: string, switchCode: number) {
        if (!socket) return;

        const encoder = new TextEncoder();
        const data = encoder.encode(msg);

        const buffer = new Uint8Array(1 + data.byteLength);

        buffer[0] = switchCode;
        buffer.set(new Uint8Array(data.buffer), 1);

        socket.send(buffer);
    }

    const onTerminalResize = (cols: number, rows: number) => {
        if (!socket) return;

        const str = JSON.stringify({
            Width: cols,
            Height: rows,
        });

        sendStringCommand(str, 4);
    };

    // useEffect(() => {
    //
    // }, [socket]);

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
                    <DynamicTerminal terminal={terminal} setTerminal={setTerminal} onTerminalResize={onTerminalResize} />
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
