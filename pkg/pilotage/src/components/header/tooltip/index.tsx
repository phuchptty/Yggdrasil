import Link from 'next/link';
import React from 'react';
import { Tooltip } from 'antd';
import styles from './index.module.scss';

type PropsType = {
    title: string;
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    target?: string;
};

const CustomTooltip: React.FC<PropsType> = ({ title, href, children, onClick, target }) => {
    return (
        <div className={styles.customTooltip}>
            {href ? (
                <Link passHref legacyBehavior href={href} style={{ cursor: 'pointer' }} target={target}>
                    <a target={target}>
                        <Tooltip overlayClassName={styles.overlay} placement="bottom" title={title} color="#d6e6ff42">
                            {children}
                        </Tooltip>
                    </a>
                </Link>
            ) : (
                <Tooltip overlayClassName={styles.overlay} placement="bottom" title={title} color="#d6e6ff42">
                    <div onClick={onClick}>{children}</div>
                </Tooltip>
            )}
        </div>
    );
};

export default CustomTooltip;
