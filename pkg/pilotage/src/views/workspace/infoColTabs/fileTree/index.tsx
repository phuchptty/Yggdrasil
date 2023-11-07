import { Button, Input, Menu, message, Modal, Spin, Tooltip, Tree } from 'antd';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { convertDataToAntDesignTree } from '@/utils';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import * as React from 'react';
import { addWorkspaceFile, openNewFile } from '@/stores/slices/workspaceFile.slice';
import { FileAddOutlined, ReloadOutlined } from '@ant-design/icons';
import { DeletePathResponse, DirFlatTreeResponse, FileContentResponse, FileCreateResponse } from '@/types';
import { Socket } from 'socket.io-client';
import { BeaconEvent } from '@/constants/beaconEvent';

import { DataNode } from 'antd/es/tree';

const { DirectoryTree } = Tree;

enum ContextMenuAction {
    RENAME = 'RENAME',
    DELETE = 'DELETE',
}

type Props = {
    beaconSocket?: Socket;
};

export default function InfoColTabFile({ beaconSocket }: Props) {
    const dispatch = useAppDispatch();
    const [messageApi, messageContext] = message.useMessage();
    const [modalApi, modalContext] = Modal.useModal();

    // Open file loading
    const [fileLoading, setFileLoading] = useState<boolean>(false);

    // workspace file redux store
    const workspaceFileData = useAppSelector((state) => state.workspaceFileSlice);

    // File tree structure
    const [structure, setStructure] = useState<DataNode[]>([]);

    // Add new file
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
    const [newFileName, setNewFileName] = useState<string>('');

    // Context menu
    const [contextMenuFile, setContextMenuFile] = useState<string>();

    // Get file tree structure
    const getStructure = () => {
        if (!beaconSocket) return;

        // Get list file from server
        beaconSocket.emit(
            BeaconEvent.DIR_FLAT_TREE,
            {
                params: {
                    path: '',
                },
            },
            (res: DirFlatTreeResponse) => {
                if (!res.success) {
                    messageApi.error('Lỗi khi lấy danh sách file');
                    return;
                }

                const data = res.data;

                // Convert to ant design tree
                const structure = convertDataToAntDesignTree(data);
                setStructure(structure);
            },
        );
    };

    // Get file tree structure when beacon socket connected or reconnected
    useEffect(() => {
        if (!beaconSocket) return;

        setTimeout(() => {
            getStructure();
        }, 800);

        // Get structure every 2s
        setInterval(() => {
            getStructure();
        }, 3000);
    }, [beaconSocket]);

    // Open file
    const onDoubleClick = (_: any, node: any) => {
        setFileLoading(true);

        // Check if exist in store = file still open
        const file = workspaceFileData.workspaceFiles.find((item) => item.path === node.key);

        // If is folder => skip
        if (node.isLeaf === false) {
            setFileLoading(false);
            return;
        }

        if (file) {
            dispatch(openNewFile(node.key));

            // If file no need to load
            setFileLoading(false);

            return;
        }

        // If not fetch file from server
        if (!beaconSocket) {
            setFileLoading(false);
            return;
        }

        beaconSocket.emit(
            BeaconEvent.GET_FILE_CONTENT,
            {
                params: {
                    path: node.key,
                },
            },
            (res: FileContentResponse) => {
                if (!res.success) {
                    messageApi.error('Lỗi khi lấy nội dung file');
                    return;
                }

                dispatch(addWorkspaceFile(res.data));
                dispatch(openNewFile(res.data.path));

                setFileLoading(false);
            },
        );
    };

    const addFile = () => {
        if (!beaconSocket) return;

        beaconSocket.emit(
            BeaconEvent.CREATE_FILE,
            {
                params: {
                    path: newFileName,
                },
            },
            (res: FileCreateResponse) => {
                if (!res.success) {
                    messageApi.error('Lỗi khi tạo file');
                    return;
                }

                dispatch(openNewFile(res.data));
                setFileLoading(false);

                getStructure();
            },
        );

        setIsModalOpen(false);
        setNewFileName('');
    };

    const onRightClick = (e: any) => {
        // Save temp
        setContextMenuFile(e.node.key);

        // Open context menu
        const el = document.getElementById('ctxMenu');
        const pos = e.event;

        Object.assign(el!.style, {
            left: `${pos.pageX}px`,
            top: `${pos.pageY}px`,
            display: 'block',
            position: 'fixed',
        });
    };

    const closeContextMenu = () => {
        const el = document.getElementById('ctxMenu');
        el!.style.display = 'none';
    };

    useEffect(() => {
        const event = (e: any) => {
            let inside = (e.target as HTMLElement).closest('#ctxMenu');
            if (!inside) closeContextMenu();
        };

        document.addEventListener('click', event);

        const fileTreeEl = document.getElementById('fileTree');
        fileTreeEl!.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            document.removeEventListener('click', event);
            fileTreeEl!.removeEventListener('contextmenu', (e) => e.preventDefault());
        };
    }, []);

    // Context MENU start

    const deleteFile = () => {
        if (!beaconSocket) return;

        beaconSocket.emit(
            BeaconEvent.DELETE,
            {
                params: {
                    path: contextMenuFile,
                },
            },
            (res: DeletePathResponse) => {
                if (!res.success) {
                    messageApi.error('Lỗi khi xoá file');
                    return;
                }

                getStructure();
            },
        );
    };

    const onClickMenu = (e: any) => {
        switch (e.key) {
            case ContextMenuAction.RENAME:
                setIsRenameModalOpen(true);
                break;

            case ContextMenuAction.DELETE:
                modalApi.confirm({
                    title: 'Xác nhận',
                    content: 'Bạn có chắc chắn muốn xoá?',
                    okText: 'Đồng ý',
                    cancelText: 'Hủy',
                    style: {
                        color: '#fff',
                    },
                    onOk: () => {
                        deleteFile();
                    },
                });
                break;
        }
    };

    const onRename = () => {
        if (!beaconSocket) return;

        beaconSocket.emit(
            BeaconEvent.RENAME,
            {
                params: {
                    path: contextMenuFile,
                    newPath: newFileName,
                },
            },
            (res: DeletePathResponse) => {
                if (!res.success) {
                    messageApi.error('Lỗi khi đổi tên file');
                    return;
                }

                getStructure();

                setIsRenameModalOpen(false);
                setNewFileName('');
            },
        );
    };

    return (
        <div id="fileTree">
            {messageContext}
            {modalContext}

            <div className={styles.columnHeader}>
                <div className={styles.columnHeaderContent}>
                    <div className={`display--flex flex-direction--row ${styles.gap}`}>
                        <p className={styles.columnTitle}>Folder</p>
                        <Spin spinning={fileLoading} size={'small'} className={styles.spin} />
                    </div>

                    <div className={styles.headerDiv}>
                        <Tooltip title="Tải lại" placement={'bottom'} arrow={false}>
                            <Button type={'text'} onClick={() => getStructure()} icon={<ReloadOutlined />}></Button>
                        </Tooltip>

                        <Tooltip title="Tạo mới" placement={'bottom'} arrow={false}>
                            <Button type={'text'} onClick={() => setIsModalOpen(true)} icon={<FileAddOutlined />}></Button>
                        </Tooltip>

                        {/*<button>D</button>*/}
                    </div>
                </div>
            </div>

            <div className={styles.container}>
                <DirectoryTree
                    className={styles.folderTree}
                    multiple
                    defaultExpandAll
                    treeData={structure}
                    onDoubleClick={onDoubleClick}
                    onRightClick={onRightClick}
                />
            </div>

            <div>
                <Modal
                    title="Thêm file mới"
                    className={styles.addNewFileModal}
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onOk={addFile}
                    cancelText="Huỷ bỏ"
                >
                    <Input placeholder="Tên file" className="mt--2" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
                </Modal>

                <Modal
                    title="Đổi tên"
                    className={styles.addNewFileModal}
                    open={isRenameModalOpen}
                    onCancel={() => setIsRenameModalOpen(false)}
                    onOk={onRename}
                    cancelText="Huỷ bỏ"
                >
                    <Input
                        placeholder="Đổi tên file"
                        className="mt--2"
                        value={newFileName || contextMenuFile}
                        onChange={(e) => setNewFileName(e.target.value)}
                    />
                </Modal>
            </div>

            <div id="ctxMenu" className={styles.ctxMenu}>
                <Menu
                    selectable={false}
                    items={[
                        {
                            key: ContextMenuAction.RENAME,
                            label: 'Đổi tên',
                        },
                        {
                            type: 'divider',
                        },
                        {
                            key: ContextMenuAction.DELETE,
                            label: 'Xóa',
                            danger: true,
                        },
                    ]}
                    theme={'dark'}
                    onClick={onClickMenu}
                />
            </div>
        </div>
    );
}
