import { Avatar, Dropdown, MenuProps, message, Modal, Space, Typography } from 'antd';
import styles from '@/components/header/index.module.scss';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { reset } from '@/stores/slices/auth.slice';
import { doLogin } from '@/utils';

export default function HeaderDesktopUser() {
    const dispatch = useAppDispatch();
    const me = useAppSelector((state) => state.authSlice.userData);

    const menuItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Space direction={'horizontal'} size={16}>
                    <Avatar src={'/images/default-user-avatar.jpg'} size="large" alt="Elysia xink vl">
                        {me?.username}
                    </Avatar>

                    <div>
                        <Typography.Paragraph className={styles.username}>
                            {me?.firstName} {me?.lastName}
                        </Typography.Paragraph>

                        <Typography.Paragraph className="mb--0 color--neutral-600 font-size--12">{me?.email}</Typography.Paragraph>
                    </div>
                </Space>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Đăng xuất',
            danger: true,
            onClick: () => doLogout(),
        },
    ];

    const doSsoLogin = () => {
        doLogin().catch((e) => {
            console.error(e);
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        });
    };

    const doLogout = () => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn đăng xuất?',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            style: {
                color: '#fff',
            },
            onOk: () => {
                signOut().then(() => {
                    dispatch(reset());
                });
            },
        });
    };

    return (
        <>
            {me ? (
                <Space>
                    <div id="menuAvatar">
                        <Dropdown
                            placement="bottomRight"
                            trigger={['click']}
                            getPopupContainer={() => document.getElementById('menuAvatar') as HTMLElement}
                            menu={{ items: menuItems }}
                        >
                            <Avatar
                                src={'/images/default-user-avatar.jpg'}
                                size="large"
                                alt="Elysia xink vl"
                            />
                        </Dropdown>
                    </div>
                </Space>
            ) : (
                <>
                    <button className={`mx--12 font-size--14 color--neutral-100 ${styles.btnLogin}`} onClick={doSsoLogin}>
                        Đăng nhập/Đăng ký
                    </button>
                </>
            )}
        </>
    );
}
