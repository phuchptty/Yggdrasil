import { useEffect, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { MittEvent, useMitt } from '@/lib/mitt';
import { Playground_Workspace } from '@/graphql/generated/types';
import { usePlayground_UpdateWorkspaceMutation } from '@/graphql/generated/playground.generated';
import styles from './index.module.scss';

export default function ChangeTitleModal() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
    const [workspaceData, setWorkspaceData] = useState<Playground_Workspace>();
    const [newName, setNewName] = useState<string>('');
    const [messageApi, messageContext] = message.useMessage();

    const [updateWorkspaceMutation] = usePlayground_UpdateWorkspaceMutation();

    const { emitter } = useMitt();

    useEffect(() => {
        // Listen to event from modal
        emitter.on(MittEvent.HOME_CHANGE_WORKSPACE_TITLE_MODAL_VISIBLE, (data: boolean) => {
            setIsModalOpen(data);
        });

        emitter.on(MittEvent.HOME_CHANGE_WORKSPACE_DATA, (value: Playground_Workspace) => {
            setWorkspaceData(value);
            setNewName(value.title);
        });
    }, []);

    const onSave = async () => {
        if (!workspaceData) return;

        setIsModalLoading(true);

        try {
            const { data, errors } = await updateWorkspaceMutation({
                variables: {
                    playgroundUpdateWorkspaceId: workspaceData._id,
                    input: {
                        title: newName,
                    },
                },
            });

            if (errors) {
                console.error(errors);
                messageApi.error(errors[0].message);
                setIsModalLoading(false);
                setIsModalOpen(false);
                return;
            }

            if (data?.playground_updateWorkspace) {
                messageApi.success('Cập nhật tên thành công');
                setIsModalLoading(false);
                setIsModalOpen(false);

                emitter.emit(MittEvent.HOME_REFETCH_WORKSPACE);
            }
        } catch (e) {
            console.error(e);
            messageApi.error('Có lỗi xảy ra');
            setIsModalLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <Modal
            title="Đổi tên Workspace"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={onSave}
            cancelText="Huỷ bỏ"
            confirmLoading={isModalLoading}
            rootClassName={styles.changeTitleModal}
        >
            {messageContext}
            <Input placeholder="Nhập tên workspace" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </Modal>
    );
}
