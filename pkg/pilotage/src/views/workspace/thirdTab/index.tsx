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
    lighthouseSocket: Socket;
    isExecuting: boolean;
    setIsExecuting: (isExecuting: boolean) => void;
};

const k8sProtocols = ['v4.channel.k8s.io', 'v3.channel.k8s.io', 'v2.channel.k8s.io', 'channel.k8s.io'];

export default function WorkspaceThirdCol({ workspaceData, accessToken, isExecuting, setIsExecuting, vmData, lighthouseSocket }: Props) {
    const dispatch = useAppDispatch();
    const [messageApi, messageContext] = message.useMessage();

    const currentFile = useAppSelector((state) => state.workspaceFileSlice.currentFile);
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice.workspaceFiles);

    const [terminal, setTerminal] = useState<Terminal>();
    const [socket, setSocket] = useState<WebSocket>();

    // Exec url
    const [execUrl, setExecUrl] = useState<string>();

    useEffect(() => {
        if (!terminal) {
            return;
        }

        let socConn: WebSocket;
        let firstConnect = true;
        let socketErrorCount = 0;
        let localExecUrl: string;

        lighthouseSocket.emit(
            LighthouseEvent.REQUEST_ATTACH_URL,
            {
                workspaceId: vmData.workspaceId,
                podName: vmData.podName,
            },
            (requestAttachRes: RequestExecUrlResponse) => {
                console.log(requestAttachRes);
                setExecUrl(requestAttachRes.execHost);
                localExecUrl = requestAttachRes.execHost;

                terminal.writeln('Get exec url success. Connecting...\n');

                // Connect to socket
                setTimeout(() => {
                    socketConnect();
                }, 1000);
            },
        );

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

            socConn = new WebSocket(localExecUrl, k8sProtocols);
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
                    const buffer = new Uint8Array([0]);
                    socConn.send(buffer);
                }, 5 * 1000);
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
                terminal.writeln("Error: Couldn't connect to console. Reconnecting...\n");
                socketErrorCount += 1;
            };

            socConn.onclose = function (e) {
                console.log(`Error code: ${e.code} - ${e.reason} console disconnected. reconnecting...`);
                window.clearInterval(alive);

                // reconnect
                if (socketErrorCount <= 10) {
                    setTimeout(() => {
                        socketConnect();
                    }, 100);
                }
            };
        }

        // Watch terminal input
        terminal.onData((data) => {
            sendMessage(data, 0);
        });

        return () => {
            terminal?.dispose();

            if (socConn) {
                socConn.close();
            }
        };
    }, [terminal]);

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
    //     if (!isExecuting) return;
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
