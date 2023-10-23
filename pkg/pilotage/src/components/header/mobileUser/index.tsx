'use client';

import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';
import styles from '@/components/header/index.module.scss';
import Image from 'next/image';

// Icon
import optionIcon from '@/assets/icons/home/option.svg';

export default function HeaderMobileUser() {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div className={styles.mobileMenu}>
                    <button className={`mx--12 font-size--14 color--neutral-100 ${styles.btnLogin}`}>Đăng nhập/Đăng ký</button>,
                </div>
            ),
        },
    ];

    return (
        <div className="hide--xl hide--lg hide--md">
            <div id="mobileMenu">
                <Dropdown placement="bottomRight" trigger={['click']} menu={{ items }}>
                    <Button className={styles.optionBtn}>
                        <Image
                            src={optionIcon}
                            alt="TEK4.VN-icon"
                            width={24}
                            height={24}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                        />
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
}
