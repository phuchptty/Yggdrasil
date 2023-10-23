import { Playground_LanguagesQuery, usePlayground_GetAllPublicWorkspacesQuery } from '@/graphql/generated/playground.generated';
import styles from './index.module.scss';
import Image from 'next/image';
import chevronLeft from '@/assets/icons/home/chevron-left.svg';
import chevronRight from '@/assets/icons/home/chevron-right.svg';
import React, { useEffect, useRef } from 'react';
import codeIcon from '@/assets/icons/home/mingcute_code-line.svg';
import { Spin } from 'antd';
import SocialTabItemCard from '@/views/home/socialTab/itemCard';
import { Playground_Workspace } from '@/graphql/generated/types';
import { register } from 'swiper/element/bundle';

type Props = {
    languageData: Playground_LanguagesQuery['playground_languages'][0];
};

export default function ViewHomeSocialLanguageItem({ languageData }: Props) {
    const swiperElRef = useRef<any>(null);

    const { data, error, loading } = usePlayground_GetAllPublicWorkspacesQuery({
        variables: {
            option: {
                filter: {
                    workspaceLanguage: languageData._id,
                },
                perPage: 20,
                sort: {
                    createdAt: 'desc',
                },
            },
        },
    });

    useEffect(() => {
        // Init swiper only when data is not null
        if (data) {
            register();

            const params = {
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

    return (
        <>
            <div className={styles.zoneTitle}>
                <div className={styles.zoneTitleLeft}>
                    <Image src={codeIcon} alt="code icon" className={styles.languageZoneTitleIcon} />
                    <span className={styles.languageZoneTitleText}>{languageData.name}</span>
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
                            data.playground_getAllPublicWorkspaces.node?.map((item, i) => (
                                <swiper-slide key={i}>
                                    <SocialTabItemCard data={item as Playground_Workspace} />
                                </swiper-slide>
                            ))}
                    </swiper-container>
                )}
            </div>
        </>
    );
}
