import React from 'react';

import styles from './index.module.scss';

type PropsType = {
    children?: React.ReactNode;
    fluid?: boolean;
    className?: any;
};

const Container: React.FC<PropsType> = ({ children, fluid = false, className = '' }) => {
    return <div className={`${fluid ? styles.containerFluid : styles.container} ${className}`}>{children}</div>;
};

export default Container;
