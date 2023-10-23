import React, { useState } from 'react';
import styles from './index.module.scss';
import Image from 'next/image';

import chevronRight from '@/assets/icons/workspace/navigate-next.svg';
import shareIcon from '@/assets/icons/workspace/mdi_share.svg';
import { useAppSelector } from '@/stores/hook';
import { Playground_WorkspacePermission } from '@/graphql/generated/types';
import {Button, Input, message, Modal, Tooltip} from 'antd';
import { usePlayground_UpdateWorkspaceMutation } from '@/graphql/generated/playground.generated';
import getConfig from 'next/config';
import { CopyOutlined } from '@ant-design/icons';

export default function WorkspaceHeaderRightBtn() {
    const { publicRuntimeConfig } = getConfig();
    const { SITE_URL } = publicRuntimeConfig;

    const workspaceData = useAppSelector((state) => state.workspaceSlice);
    const [modal, contextHolder] = Modal.useModal();
    const [messageApi, messageContextHolder] = message.useMessage();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const [updateWorkspaceMutation] = usePlayground_UpdateWorkspaceMutation();

    const handleShareWorkspace = () => {
        if (workspaceData.permission === Playground_WorkspacePermission.Public) {
            setIsShareModalOpen(true);
            return;
        }

        modal.confirm({
            title: 'Bạn có chắc muốn chia sẻ workspace này?',
            content: 'Để chia sẻ workspace này, workspace sẽ được chuyển sang trạng thái công khai!',
            okText: 'OK',
            cancelText: 'Huỷ',
            onOk: async () => {
                const { data, errors } = await updateWorkspaceMutation({
                    variables: {
                        playgroundUpdateWorkspaceId: workspaceData._id,
                        input: {
                            permission: Playground_WorkspacePermission.Public,
                        },
                    },
                });

                if (errors) {
                    console.error(errors);
                    messageApi.error(errors[0].message);
                    return;
                }

                if (data?.playground_updateWorkspace) {
                    messageApi.success('Cập nhật workspace thành công');
                    setIsShareModalOpen(true);
                }
            },
        });
    };

    const getWorkspaceLink = () => {
        return `${SITE_URL}/workspace/${workspaceData.slug}`;
    };

    return (
        <>
            {contextHolder}
            {messageContextHolder}

            {/*<button className={styles.btn}>*/}
            {/*    <span className={styles.btnText}>Khoá học liên quan</span>*/}
            {/*    <Image src={chevronRight} alt="Chevron Right" />*/}
            {/*</button>*/}

            <button className={styles.btn} onClick={handleShareWorkspace}>
                <Image src={shareIcon} alt="Chevron Right" />
                <span className={styles.btnText}>Chia sẻ</span>
            </button>

            {/*<button className={styles.newBtn}>Tạo mới</button>*/}

            <Modal
                open={isShareModalOpen}
                footer={[
                    <Button key="close" type={'default'} onClick={() => setIsShareModalOpen(false)}>
                        Đóng
                    </Button>,
                ]}
                className={styles.shareModal}
            >
                <p className={styles.shareModalTitle}>Copy link chia sẻ</p>

                <Input
                    placeholder="Basic usage"
                    value={getWorkspaceLink()}
                    disabled
                    suffix={
                    <Tooltip placement={'bottom'} title={'Sao chép'} arrow={false}>
                        <Button
                            type="text"
                            onClick={() => {
                                navigator.clipboard.writeText(getWorkspaceLink());
                                messageApi.success('Đã copy link');
                            }}
                            icon={<CopyOutlined />}
                        />
                    </Tooltip>
                    }
                />
            </Modal>
        </>
    );
}
