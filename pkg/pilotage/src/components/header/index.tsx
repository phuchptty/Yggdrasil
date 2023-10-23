import React from 'react';
import { Col, Input, Row, Space } from 'antd';
import Layout from '@/components/layout';
import styles from './index.module.scss';
import Link from 'next/link';
import Image from 'next/image';

// Images & icons
import logoImage from '@/assets/images/logo.png';
import searchDefaultIcon from '@/assets/icons/home/search-default-icon.svg';
import HeaderDesktopUser from '@/components/header/desktopUser';
import HeaderMobileUser from '@/components/header/mobileUser';

export default function Header() {
    return (
        <div className={styles.header}>
            <Layout.Container>
                <Row align="middle" justify="space-between" className={styles.headerRow}>
                    <Col xl={6} lg={6} md={4} sm={4} xs={4} className="display--flex justify-content--flexStart flex-direction--row">
                        <Space>
                            <div className={`${styles.logo}`}>
                                <Link passHref legacyBehavior href="/">
                                    <a>
                                        <Image
                                            src={logoImage}
                                            alt="TEK4.VN-logo"
                                            className="cursor--pointer"
                                            width={40}
                                            height={40}
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                            }}
                                        />
                                    </a>
                                </Link>
                            </div>

                            <Input
                                readOnly
                                className={`${styles.searchButton} hide--md hide--sm`}
                                placeholder="Tìm kiếm"
                                maxLength={246}
                                prefix={<Image src={searchDefaultIcon} alt="search-icon" />}
                            />

                            {/*<Image src={searchDefaultIcon} alt="search-icon" className="hide--xl pr--10" />*/}
                        </Space>
                    </Col>

                    <Col
                        xl={12}
                        lg={10}
                        md={12}
                        sm={8}
                        xs={8}
                        className={`${styles.iconWrapper} display--flex align-items--center justify-content--center`}
                    ></Col>

                    <Col
                        xl={6}
                        lg={8}
                        md={8}
                        sm={8}
                        xs={0}
                        className={`display--flex justify-content--flexEnd align-items--center ${styles.sectionWrapper}`}
                    >
                        <HeaderDesktopUser />
                    </Col>

                    <Col xl={0} lg={0} md={0} sm={4} xs={4} className="display--flex justify-content--flexEnd align-items--center">
                        <HeaderMobileUser />
                    </Col>
                </Row>

                {/*<Common.CustomModal.Logout isVisibleModal={isVisibleModalLogout} setIsVisibleModal={setIsVisibleModalLogout} />*/}
            </Layout.Container>
        </div>
    );
}
