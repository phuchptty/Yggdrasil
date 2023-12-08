import React, { ReactNode } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '@/components/header';
import Layout from '@/components/layout';
import { Tabs } from 'antd';
import apolloClientSSR from '@/lib/apolloClientSSR';
import {
    Playground_CountPublicWorkspaceByLanguagesDocument,
    Playground_CountPublicWorkspaceByLanguagesQuery,
    Playground_LanguagesDocument,
    Playground_LanguagesQuery,
} from '@/graphql/graphql';
import ViewHomeContentTabBar from '@/views/home/createTab';

import styles from './index.module.scss';
import ViewHomeSocialTab from '@/views/home/socialTab';

const DynamicViewHomeManageTab = dynamic(() => import('@/views/home/manageTab'), { loading: () => <p>Loading...</p> });

export async function getStaticProps() {
    try {
        const { data: languageData, error: languageError } = await apolloClientSSR.query<Playground_LanguagesQuery>({
            query: Playground_LanguagesDocument,
        });

        if (languageError) {
            console.error(languageError);
        }

        return {
            props: {
                languages: languageData,
            },
        };
    } catch (e) {
        console.log(e);

        return {
            props: {},
        };
    }
}

type Props = {
    languages: Playground_LanguagesQuery;
    countData: Playground_CountPublicWorkspaceByLanguagesQuery['playground_countPublicWorkspaceByLanguages'];
};

export default function Page({ languages, countData }: Props) {
    const [tabActive, setTabActive] = React.useState('0');

    const tabItems = [
        {
            key: '0',
            label: `Tạo mới`,
            children: <ViewHomeContentTabBar languages={languages} />,
        },
        {
            key: '1',
            label: `Quản lý`,
            children: <DynamicViewHomeManageTab />,
        },
        {
            key: '2',
            label: `Cộng đồng`,
            children: <ViewHomeSocialTab languages={languages} />,
        },
    ];

    return (
        <>
            <div className={styles.mainZone}>
                <div className={styles.btnTabBar}>
                    <div className={`${styles.tabBarButton} ${tabActive === '0' ? styles.tabBarButtonActive : ''}`} onClick={() => setTabActive('0')}>
                        Tạo mới
                    </div>

                    <div className={`${styles.tabBarButton} ${tabActive === '1' ? styles.tabBarButtonActive : ''}`} onClick={() => setTabActive('1')}>
                        Quản lý
                    </div>

                    <div className={`${styles.tabBarButton} ${tabActive === '2' ? styles.tabBarButtonActive : ''}`} onClick={() => setTabActive('2')}>
                        Cộng đồng
                    </div>
                </div>

                <div className={styles.mainContent}>
                    <Tabs destroyInactiveTabPane={true} tabBarStyle={{ display: 'none' }} items={tabItems} activeKey={tabActive} />
                </div>
            </div>
        </>
    );
}

Page.getLayout = function getLayout(page: ReactNode) {
    return (
        <>
            <Head>
                <title>Yggdrasil Playground</title>
                <meta name="description" content="Yggdrasil Playground" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <Layout.Main>
                <Layout.Container>{page}</Layout.Container>
            </Layout.Main>
        </>
    );
};
