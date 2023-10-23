import React from 'react';
import styles from './index.module.scss';

type PropsType = {
    children?: React.ReactNode;
    className?: any;
};

const LayoutMain: React.FC<PropsType> = ({ children, className = '' }) => {
    return <div className={`${styles.bg} ${className}`}>{children}</div>;
};

export default LayoutMain;
