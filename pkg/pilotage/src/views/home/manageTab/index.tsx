import { Col, Grid, Row, Space, Tabs } from 'antd';
import { Playground_WorkspacePermission } from '@/graphql/generated/types';
import React from 'react';
import SubTab from './subTab';

import styles from './index.module.scss';
import codeIcon from '@/assets/icons/home/mingcute_code-line.svg';
import ChangeTitleModal from '@/views/home/manageTab/changeTitleModal';

const { useBreakpoint } = Grid;

export default function ManageTab() {
    const [tabActive, setTabActive] = React.useState('0');
    const { lg } = useBreakpoint();

    const tabItems = [
        {
            key: '0',
            label: `Gần đây`,
            children: <SubTab icon={codeIcon} title={'Bạn đã tạo gần đây'} />,
        },
        {
            key: '1',
            label: `Riêng tư`,
            children: (
                <SubTab
                    icon={codeIcon}
                    title={'Riêng tư'}
                    filter={{
                        permission: Playground_WorkspacePermission.Private,
                    }}
                />
            ),
        },
        {
            key: '2',
            label: `Công khai`,
            children: (
                <SubTab
                    icon={codeIcon}
                    title={'Công khai'}
                    filter={{
                        permission: Playground_WorkspacePermission.Public,
                    }}
                />
            ),
        },
    ];

    return (
        <>
            <Row gutter={[32, 34]}>
                <Col span={24} lg={3}>
                    <Space size={16} direction={lg ? 'vertical' : 'horizontal'} className={styles.space}>
                        <button className={`${styles.button} ${tabActive === '0' ? styles.active : ''}`} onClick={() => setTabActive('0')}>
                            Gần đây
                        </button>

                        <button className={`${styles.button} ${tabActive === '1' ? styles.active : ''}`} onClick={() => setTabActive('1')}>
                            Riêng tư
                        </button>

                        <button className={`${styles.button} ${tabActive === '2' ? styles.active : ''}`} onClick={() => setTabActive('2')}>
                            Công khai
                        </button>
                    </Space>
                </Col>

                <Col span={24} lg={21}>
                    <Tabs destroyInactiveTabPane={true} tabBarStyle={{ display: 'none' }} items={tabItems} activeKey={tabActive} />
                </Col>
            </Row>

            <ChangeTitleModal />
        </>
    );
}
