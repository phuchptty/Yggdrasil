import React from 'react';
import Image from 'next/image';
import styles from './index.module.scss';
import { useAppSelector } from '@/stores/hook';
import { Playground_WorkspacePermission } from '@/graphql/generated/types';

import globalIcon from '@/assets/icons/workspace/global.svg';
import lockIcon from '@/assets/icons/workspace/ic_outline-lock.svg';

export default function WorkspaceTitle() {
    const workspaceData = useAppSelector((state) => state.workspaceSlice);

    return (
        <>
            <p className={styles.workspaceTitle}>
                {workspaceData?.title || workspaceData?.slug || 'Không xác định'}
            </p>

            {workspaceData.permission === Playground_WorkspacePermission.Public ? (
                <Image src={globalIcon} alt="global icon" />
            ) : (
                <Image src={lockIcon} alt="private icon" />
            )}
        </>
    );
}
