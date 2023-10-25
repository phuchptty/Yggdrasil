import React, { useEffect, useState } from 'react';
import { Button, Tabs, Tooltip } from 'antd';
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

type Props = {
    workspaceData: Playground_Workspace;
    accessToken: string;
};

export default function ViewWorkspace({ workspaceData, accessToken }: Props) {
    const [infoColActiveTab, setInfoColActiveTab] = useState('0');
    const dispatch = useDispatch();

    const [isExecuting, setIsExecuting] = useState(false);

    const handleRunCode = () => {
        setIsExecuting(true);

        // setTimeout(() => {
        //     setIsExecuting(false);
        // }, 2000);
    };

    useEffect(() => {
        dispatch(setWorkspace(workspaceData));
    }, []);

    const infoColTabs = [
        {
            key: '0',
            label: `Quản lý file`,
            children: <InfoColTabFile workspaceData={workspaceData} accessToken={accessToken} />,
        },
        {
            key: '1',
            label: `Thông in`,
            children: <InfoColTabInfo />,
        },
    ];

    return (
        <div className={'display--flex flex-direction--row h--full'}>
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

                {/*<EditorColumn onRunClick={handleRunCode} isExecuting={isExecuting} />*/}

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
