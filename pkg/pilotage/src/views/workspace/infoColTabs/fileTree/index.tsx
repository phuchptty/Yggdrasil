import { Button, Input, Menu, message, Modal, Spin, Tooltip, Tree } from 'antd';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { convertDataToAntDesignTree } from '@/utils';
import { useEffect, useState } from 'react';
import { DataNode } from 'antd/es/tree';
import { v4 as uuidV4 } from 'uuid';
const { DirectoryTree } = Tree;
import styles from './index.module.scss';
import * as React from 'react';
import { addNewFile, addWorkspaceFile, closeFile, openNewFile, removeMemorizeFile } from '@/stores/slices/workspaceFile.slice';
import { FileAddOutlined } from '@ant-design/icons';
import { io } from "socket.io-client";

enum ContextMenuAction {
    RENAME = 'RENAME',
    DELETE = 'DELETE',
}

export default function InfoColTabFile() {
    const dispatch = useAppDispatch();
    const [messageApi, messageContext] = message.useMessage();

    const [fileLoading, setFileLoading] = useState<boolean>(false);

    const workspaceData = useAppSelector((state) => state.workspaceSlice);
    const workspaceFileData = useAppSelector((state) => state.workspaceFileSlice);

    const [structure, setStructure] = useState<DataNode[]>([]);

    // Add new file
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newFileName, setNewFileName] = useState<string>('');

    // Context menu
    const [contextMenuFile, setContextMenuFile] = useState<any>(null);

    // First time connect with beacon
    useEffect(() => {
        console.log(workspaceData);
    }, []);


    // useEffect(() => {
    //     // This filter out files that already exist in workspace (new file only)
    //     const filteredFiles = workspaceFileData.workspaceFiles
    //         .filter((file) => !(workspaceData.workspaceFiles || []).some((workspaceFile) => workspaceFile.path === file.path))
    //         .map((x) => ({
    //             _id: x._id,
    //             name: x.name,
    //             path: x.path,
    //         }));
    //
    //     const mapWorkspaceFile = (workspaceData.workspaceFiles || []).map((x) => ({
    //         _id: x._id,
    //         name: x.name,
    //         path: x.path,
    //     }));
    //
    //     const fileStructure = [...mapWorkspaceFile, ...filteredFiles];
    //
    //     setStructure(convertDataToAntDesignTree(fileStructure));
    // }, [workspaceData.workspaceFiles, workspaceFileData.workspaceFiles]);

    // Fetch file from server
    // useEffect(() => {
    //     if (!scatteredFileRsp.data) return;
    //
    //     const fileData = scatteredFileRsp.data.playground_getScatteredWorkspaceFile;
    //
    //     if (!fileData) {
    //         console.log('File not found');
    //         return;
    //     }
    //
    //     const checkExist = workspaceFileData.workspaceFiles.find((item) => item.path === fileData.path);
    //
    //     if (checkExist) return;
    //
    //     dispatch(addWorkspaceFile(fileData));
    //     dispatch(openNewFile(fileData.path));
    //
    //     setFileLoading(false);
    // }, [scatteredFileRsp]);

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
        // fetchQueryScatteredFile({
        //     variables: {
        //         workspaceId: workspaceData._id,
        //         filePath: node.key,
        //     },
        // });

        // Close loading in useEffect not here
    };

    const addFile = () => {
        dispatch(
            addNewFile({
                _id: uuidV4(),
                name: newFileName,
                path: newFileName,
                content: '',
            }),
        );

        setIsModalOpen(false);
    };

    const onRightClick = (e: any) => {
        // Save temp
        // const file = (workspaceData.workspaceFiles || []).find((item) => item.path === e.node.key);
        // if (!file) return;
        // setContextMenuFile(file);

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

    const deleteFile = async () => {
        // try {
        //     const rsp = await deleteWorkspaceFileMutation({
        //         variables: {
        //             playgroundDeleteWorkspaceFileId: workspaceData._id,
        //             filePath: contextMenuFile.path,
        //         },
        //     });
        //
        //     if (rsp.errors) {
        //         throw rsp.errors;
        //     }
        //
        //     if (rsp.data?.playground_deleteWorkspaceFile) {
        //         // close file
        //         dispatch(closeFile(contextMenuFile.path));
        //         dispatch(removeMemorizeFile(contextMenuFile.path));
        //
        //         // Remove file from tree
        //         dispatch(deleteWorkspaceFile(contextMenuFile.path));
        //
        //         setStructure(
        //             convertDataToAntDesignTree(rsp.data.playground_deleteWorkspaceFile.workspaceFiles || workspaceData.workspaceFiles || []),
        //         );
        //
        //         // close context menu
        //         closeContextMenu();
        //
        //         messageApi.success('Xoá file thành công');
        //     }
        // } catch (e) {
        //     console.error(e);
        //     messageApi.error('Không thể xoá file');
        // }
    };

    const onClickMenu = (e: any) => {
        switch (e.key) {
            case ContextMenuAction.RENAME:
                break;
            case ContextMenuAction.DELETE:
                Modal.confirm({
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

    return (
        <div id="fileTree">
            {messageContext}

            <div className={styles.columnHeader}>
                <div className={styles.columnHeaderContent}>
                    <div className={`display--flex flex-direction--row ${styles.gap}`}>
                        <p className={styles.columnTitle}>Folder</p>
                        <Spin spinning={fileLoading} size={'small'} className={styles.spin} />
                    </div>

                    <div className={styles.headerDiv}>
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
                <Modal title="Thêm file mới" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={addFile} cancelText="Huỷ bỏ">
                    <Input placeholder="Tên file" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />
                </Modal>

                {/*<Modal title="Đổi tên" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={addFile} cancelText="Huỷ bỏ">*/}
                {/*    <Input placeholder="Đổi tên file" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} />*/}
                {/*</Modal>*/}
            </div>

            <div id="ctxMenu" className={styles.ctxMenu}>
                <Menu
                    selectable={false}
                    items={[
                        // {
                        //     key: ContextMenuAction.RENAME,
                        //     label: 'Đổi tên',
                        // },
                        // {
                        //     type: 'divider',
                        // },
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
