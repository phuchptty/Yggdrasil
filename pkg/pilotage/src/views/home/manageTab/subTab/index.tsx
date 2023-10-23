import React, { useEffect, useRef, useState } from 'react';
import { usePlayground_GetAllUserWorkspacesLazyQuery, usePlayground_GetAllUserWorkspacesQuery } from '@/graphql/generated/playground.generated';
import { Button, message, Spin } from 'antd';
import ItemCard from '@/views/home/manageTab/subTab/itemCard';
import Image from 'next/image';
import { register } from 'swiper/element/bundle';
import { Playground_WorkspacePermission, Playground_WorkspaceStatus } from '@/graphql/generated/types';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import styles from './index.module.scss';
import chevronLeft from '@/assets/icons/home/chevron-left.svg';
import chevronRight from '@/assets/icons/home/chevron-right.svg';
import mobileLogin from '@/assets/images/mobile-login.svg';
import { MittEvent, useMitt } from '@/lib/mitt';
import { useAppSelector } from '@/stores/hook';
import { doLogin } from '@/utils';

type Filter = {
    status?: Playground_WorkspaceStatus;
    permission?: Playground_WorkspacePermission;
};

type Props = {
    icon: StaticImport;
    title: string;
    filter?: Filter;
};

export default function SubTab(props: Props) {
    const [messageApi, messageContext] = message.useMessage();
    const { emitter } = useMitt();

    const swiperElRef = useRef<any>({});
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const [doLazeFetch, { data, loading, error, refetch }] = usePlayground_GetAllUserWorkspacesLazyQuery({
        variables: {
            option: {
                perPage: 20,
                sort: {
                    updatedAt: -1,
                },
                filter: props.filter,
            },
        },
    });

    if (error) {
        console.error(JSON.stringify(error, null, 4));

        if (error.name === 'ApolloError' && error.message.includes('Forbidden resource')) {
            messageApi.error('Bạn chưa đăng nhập hoặc không có quyền truy cập vào tài nguyên này');
        } else {
            messageApi.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        }
    }

    useEffect(() => {
        emitter.on(MittEvent.HOME_REFETCH_WORKSPACE, () => {
            refetch();
        });

        if (isLogin) {
            doLazeFetch();
        }
    }, []);

    useEffect(() => {
        // Init swiper only when data is not null
        if (data) {
            register();

            const params = {
                grid: {
                    rows: 2,
                    fill: 'row',
                },
                breakpoints: {
                    320: {
                        slidesPerView: 3,
                        spaceBetween: 8,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 24,
                    },
                },
            };

            Object.assign(swiperElRef.current, params);

            // initialize swiper
            swiperElRef.current.initialize();
        }
    }, [data]);

    const leftBtn = () => {
        if (swiperElRef.current) {
            swiperElRef.current.swiper.slidePrev();
        }
    };

    const rightBtn = () => {
        if (swiperElRef.current) {
            swiperElRef.current.swiper.slideNext();
        }
    };

    const doSsoLogin = () => {
        doLogin().catch((e) => {
            console.error(e);
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        });
    };

    return (
        <>
            {messageContext}

            {!isLogin ? (
                <div className={styles.notLoginZone}>
                    <p className={styles.notLoginZoneTitle}>Bạn chưa đăng nhập</p>
                    <Image src={mobileLogin} alt="login moment" />

                    <Button type={'primary'} size={'large'} onClick={doSsoLogin}>
                        Đăng nhập ngay
                    </Button>
                </div>
            ) : (
                <>
                    <div className={styles.zoneTitle}>
                        <div className={styles.zoneTitleLeft}>
                            <Image src={props.icon} alt="code icon" className={styles.languageZoneTitleIcon} />
                            <span className={styles.languageZoneTitleText}>{props.title}</span>
                        </div>

                        <div className={styles.zoneTitleRight}>
                            <button className={styles.titleBtn} onClick={leftBtn}>
                                <Image src={chevronLeft} alt="chevron left icon" />
                            </button>

                            <button className={styles.titleBtn} onClick={rightBtn}>
                                <Image src={chevronRight} alt="chevron right icon" />
                            </button>
                        </div>
                    </div>

                    <div className={styles.zoneContent}>
                        {loading || error ? (
                            <div className={'display--flex justify-content--center align-items--center w--full'}>
                                <Spin spinning size={'large'} />
                            </div>
                        ) : (
                            <swiper-container init={false} ref={swiperElRef}>
                                {data &&
                                    data.playground_getAllUserWorkspaces.node?.map((item, i) => (
                                        <swiper-slide key={i}>
                                            <ItemCard data={item} />
                                        </swiper-slide>
                                    ))}
                            </swiper-container>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
