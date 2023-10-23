import { Col, Grid, Row, Space, Tabs } from 'antd';
import React from 'react';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';
import ViewHomeQuickStartTab from '@/views/home/createTab/quickStartTab';
import { Playground_LanguagesQuery } from '@/graphql/graphql';

const { useBreakpoint } = Grid;

const DynamicUpdatingFeature = dynamic(() => import('@/components/updatingFeature'), {
    loading: () => <p>Loading...</p>,
});

export default function ViewHomeContentTabBar({ languages }: { languages: Playground_LanguagesQuery }) {
    const [tabActive, setTabActive] = React.useState('0');
    const { lg } = useBreakpoint();

    const tabItems = [
        {
            key: '0',
            label: `Tạo mới`,
            children: <ViewHomeQuickStartTab languages={languages} />,
        },
        {
            key: '1',
            label: `Github`,
            children: <DynamicUpdatingFeature />,
        },
    ];

    return (
        <Row gutter={[32, 34]}>
            <Col span={24} lg={3}>
                <Space size={16} direction={lg ? 'vertical' : 'horizontal'} className={styles.space}>
                    <button className={`${styles.button} ${tabActive === '0' ? styles.active : ''}`} onClick={() => setTabActive('0')}>
                        Quick start
                    </button>

                    <button className={`${styles.button} ${tabActive === '1' ? styles.active : ''}`} onClick={() => setTabActive('1')}>
                        Github
                    </button>
                </Space>
            </Col>

            <Col span={24} lg={21}>
                <Tabs tabBarStyle={{ display: 'none' }} items={tabItems} activeKey={tabActive} />
            </Col>
        </Row>
    );
}
