import styles from './index.module.scss';
import Image from 'next/image';

import editPencilLine from '@/assets/icons/workspace/Edit_Pencil_Line_01.svg';
import { Space, Input, Divider, Select, message, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { Playground_WorkspacePermission } from '@/graphql/generated/types';
import { usePlayground_UpdateWorkspaceMutation } from '@/graphql/generated/playground.generated';
import { setWorkspace } from '@/stores/slices/workspace.slice';

const { TextArea } = Input;

export default function InfoColTabInfo() {
    // mutation
    const [updateWorkspaceMutation] = usePlayground_UpdateWorkspaceMutation();

    // redux
    const dispatch = useAppDispatch();
    const workspaceData = useAppSelector((state) => state.workspaceSlice);
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    // state
    const [description, setDescription] = useState('');
    const [workspaceName, setWorkspaceName] = useState('');
    const [workspacePermission, setWorkspacePermission] = useState<Playground_WorkspacePermission>(Playground_WorkspacePermission.Private);
    const [workspaceNameDisable, setWorkspaceNameDisable] = useState(true);
    const [saveTemplateBtnLoading, setSaveTemplateBtnLoading] = useState(false);

    // Api
    const [messageApi, messageContext] = message.useMessage();

    useEffect(() => {
        if (workspaceData) {
            setDescription(workspaceData.description || '');
            setWorkspaceName(workspaceData.title);
            setWorkspacePermission(workspaceData.permission);
        }
    }, [workspaceData]);

    const saveTemplate = async () => {
        setSaveTemplateBtnLoading(true);

        try {
            const res = await updateWorkspaceMutation({
                variables: {
                    playgroundUpdateWorkspaceId: workspaceData._id,
                    input: {
                        title: workspaceName,
                        description: description,
                        permission: workspacePermission,
                    },
                },
            });

            if (res.errors) {
                console.error(res.errors);
                messageApi.error(res.errors[0].message);
                setSaveTemplateBtnLoading(false);
                return;
            }

            if (res.data?.playground_updateWorkspace) {
                messageApi.success('Lưu template thành công');

                // update workspace data to redux
                // @ts-ignore
                dispatch(setWorkspace(res.data.playground_updateWorkspace));

                setWorkspaceNameDisable(true);
                setSaveTemplateBtnLoading(false);
            }
        } catch (error: any) {
            console.error(error);
            messageApi.error(error.message);
            setSaveTemplateBtnLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {messageContext}

            <Space size={20} direction={'vertical'} className={styles.containerSpace}>
                <p className={styles.title}>Thông tin</p>

                <div className={styles.workspaceName}>
                    <Input
                        className={styles.workspaceNameText}
                        placeholder={'Tên workspace'}
                        bordered={false}
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        disabled={workspaceNameDisable}
                    />

                    <Image
                        src={editPencilLine}
                        alt={'edit icon'}
                        className={styles.workspaceNameEditBtn}
                        onClick={() => setWorkspaceNameDisable(!workspaceNameDisable)}
                    />
                </div>

                <div>
                    <TextArea
                        bordered={false}
                        value={description}
                        onChange={(e: any) => setDescription(e.target.value)}
                        placeholder="Thêm một vài mô tả cho dự án này"
                        autoSize={{ minRows: 3, maxRows: 10 }}
                    />
                </div>

                <Divider style={{ margin: 0 }} />

                <div>
                    <Space size={8} direction={'vertical'} className={styles.containerSpace}>
                        <p className={styles.workSpacePermission}>Quyền</p>

                        <Select
                            className={styles.workSpacePermissionSelect}
                            value={workspacePermission}
                            onChange={(value: Playground_WorkspacePermission) => setWorkspacePermission(value)}
                            options={[
                                { value: Playground_WorkspacePermission.Public, label: 'Công khai' },
                                { value: Playground_WorkspacePermission.Private, label: 'Riêng tư' },
                            ]}
                        />

                        <p className={styles.workSpacePermissionSubtitle}>Mọi người có thể chỉnh sửa file này</p>
                    </Space>
                </div>

                {isLogin && (
                    <Button onClick={saveTemplate} className={styles.saveTemplateBtn} size={'large'} loading={saveTemplateBtnLoading}>
                        Lưu template
                    </Button>
                )}
            </Space>
        </div>
    );
}
