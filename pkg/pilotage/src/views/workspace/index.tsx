import React, { useEffect, useState } from 'react';
import { Button, message, Tabs, Tooltip } from 'antd';
import Image from 'next/image';
import Resizable from 'react-split';
import InfoColTabInfo from '@/views/workspace/infoColTabs/info';
import EditorColumn from './editorCol';
import { Playground_Workspace } from '@/graphql/generated/types';
import WorkspaceThirdCol from '@/views/workspace/thirdTab';
import InfoColTabFile from '@/views/workspace/infoColTabs/fileTree';
import styles from './index.module.scss';
import folderIcon from '@/assets/icons/workspace/Folder_Open.svg';
import bookIcon from '@/assets/icons/workspace/carbon_book.svg';
import { useDispatch } from 'react-redux';
import { setWorkspace } from '@/stores/slices/workspace.slice';
import { io, Socket } from 'socket.io-client';
import { BeaconConnectionMessage } from '@/types';
import { usePlayground_RequestVmForWorkspaceMutation } from '@/graphql/generated/playground.generated';

type Props = {
    workspaceData: Playground_Workspace;
    accessToken: string;
};

export default function ViewWorkspace({ workspaceData, accessToken }: Props) {
    const [infoColActiveTab, setInfoColActiveTab] = useState('0');
    const dispatch = useDispatch();
    const [messageApi, messageContext] = message.useMessage();

    // Beacon socket client
    const [beaconSocket, setBeaconSocket] = useState<Socket | undefined>();

    // Set executing code state
    const [isExecuting, setIsExecuting] = useState(false);

    // Request workspace vm
    const [requestWorkspaceMutation] = usePlayground_RequestVmForWorkspaceMutation({
        variables: {
            workspaceSlug: workspaceData.slug as string,
        },
    });

    const handleRequestVm = async () => {
        try {
            const { data, errors } = await requestWorkspaceMutation();

            if (errors) {
                console.log(errors);
                return;
            }

            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleRunCode = () => {
        setIsExecuting(true);

        // setTimeout(() => {
        //     setIsExecuting(false);
        // }, 2000);
    };

    // First time connect with beacon
    useEffect(() => {
        // Save workspace data to redux -> other components can use it
        dispatch(setWorkspace(workspaceData));

        if (beaconSocket) {
            beaconSocket.disconnect();
        }

        const beaconUrl = new URL(workspaceData.beaconHost);
        beaconUrl.searchParams.append('workspace', workspaceData._id);

        const ioCon = io(beaconUrl.toString(), {
            reconnection: true,
            extraHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        setBeaconSocket(ioCon);

        ioCon.on('connect', () => {
            console.log('connected to beacon');

            handleRequestVm();
        });

        ioCon.on('disconnect', () => {
            console.log('disconnected to beacon');
        });

        ioCon.on('CONNECTION_MESSAGE', (value: BeaconConnectionMessage) => {
            messageApi.error(value.message);
        });

        ioCon.on('exception', (value: any) => {
            console.error(value);

            messageApi.error('Lỗi ngoài dự đoán, vui lòng liên hệ với chúng tôi để được hỗ trợ.');
        });

        return () => {
            if (ioCon) {
                ioCon.disconnect();
            }
        };
    }, []);

    const infoColTabs = [
        {
            key: '0',
            label: `Quản lý file`,
            children: <InfoColTabFile beaconSocket={beaconSocket} />,
        },
        {
            key: '1',
            label: `Thông in`,
            children: <InfoColTabInfo />,
        },
    ];

    return (
        <div className={'display--flex flex-direction--row h--full'}>
            {messageContext}

            <div id={'firstCol'} className={styles.firstCol}>
                <div className={styles.toolBarSpace}>
                    <Tooltip placement={'right'} title={'Cây thư mục'}>
                        <Button
                            className={`${styles.toolBarBtn} ${infoColActiveTab === '0' ? styles.active : ''}`}
                            icon={<Image src={folderIcon} alt={'folder icon'} />}
                            size={'large'}
                            onClick={() => setInfoColActiveTab('0')}
                        />
                    </Tooltip>

                    <Tooltip placement={'right'} title={'Thông tin'}>
                        <Button
                            className={`${styles.toolBarBtn} ${infoColActiveTab === '1' ? styles.active : ''}`}
                            icon={<Image src={bookIcon} alt={'book icon'} />}
                            size={'large'}
                            onClick={() => setInfoColActiveTab('1')}
                        />
                    </Tooltip>
                </div>
            </div>

            <Resizable sizes={[20, 40, 40]} direction={'horizontal'} minSize={[0, 400, 0]} gutterSize={1} className={`split ${styles.split}`}>
                <Tabs animated tabBarStyle={{ display: 'none' }} items={infoColTabs} activeKey={infoColActiveTab} />

                <EditorColumn onRunClick={handleRunCode} isExecuting={isExecuting} beaconSocket={beaconSocket} />

                {/*<WorkspaceThirdCol*/}
                {/*    workspaceData={workspaceData}*/}
                {/*    accessToken={accessToken}*/}
                {/*    isExecuting={isExecuting}*/}
                {/*    setIsExecuting={setIsExecuting}*/}
                {/*/>*/}
            </Resizable>
        </div>
    );
}
