import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from './index.module.scss';
import loadingImage from '@/assets/icons/loading.gif';
import Image from 'next/image';

const LoadingPage = ({ routerMode = true }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(!routerMode);

    useEffect(() => {
        if (!routerMode) return;

        const handleStart = (url: string) => url !== router.asPath && setLoading(true);
        const handleComplete = (url: string) => url && setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    });

    return (
        <>
            {loading && (
                <div className={styles.loading}>
                    <div className="positon--relative">
                        <Image src={loadingImage} alt="tek4 loading" className={styles.gif} />
                    </div>
                </div>
            )}
        </>
    );
};

export default LoadingPage;
