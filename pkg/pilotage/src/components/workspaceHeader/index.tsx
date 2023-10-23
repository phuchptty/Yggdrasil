import React from 'react';
import { Col, Row } from 'antd';
import styles from './index.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout';
import WorkspaceTitle from '@/components/workspaceHeader/workspaceTitle';
import WorkspaceHeaderRightBtn from '@/components/workspaceHeader/rightBtn';

// Images & icons
import logoImage from '@/assets/images/logo.png';

export default function WorkspaceHeader() {
    return (
        <div className={styles.header}>
            <Layout.Container fluid={true}>
                <div className={styles.headerContainer}>
                    <Row align="middle" justify="space-between" className={styles.headerRow}>
                        <Col xl={6} lg={6} md={4} sm={4} xs={4} className="display--flex justify-content--flexStart flex-direction--row">
                            <Link href="/">
                                <Image src={logoImage} className={`${styles.logo}`} alt="Elysia xink vl" />
                            </Link>
                        </Col>

                        <Col
                            xl={12}
                            lg={10}
                            md={12}
                            sm={8}
                            xs={8}
                            className={`${styles.iconWrapper} display--flex align-items--center justify-content--center`}
                        >
                            {/*Center*/}
                            <WorkspaceTitle />
                        </Col>

                        <Col
                            xl={6}
                            lg={8}
                            md={8}
                            sm={8}
                            xs={0}
                            className={`display--flex justify-content--flexEnd align-items--center ${styles.sectionWrapper}`}
                        >
                            {/*Desktop*/}
                            <WorkspaceHeaderRightBtn />
                        </Col>

                        <Col xl={0} lg={0} md={0} sm={4} xs={4} className="display--flex justify-content--flexEnd align-items--center">
                            {/*Mobile*/}
                        </Col>
                    </Row>

                    {/*<Common.CustomModal.Logout isVisibleModal={isVisibleModalLogout} setIsVisibleModal={setIsVisibleModalLogout} />*/}
                </div>
            </Layout.Container>
        </div>
    );
}
