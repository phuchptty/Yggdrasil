import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import Image from 'next/image';
import ItemCard from '@/components/itemCard';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Playground_Language } from '@/graphql/generated/types';

import { register } from 'swiper/element/bundle';

import chevronLeft from '@/assets/icons/home/chevron-left.svg';
import chevronRight from '@/assets/icons/home/chevron-right.svg';

type Props = {
    icon: StaticImport;
    title: string;
    languages: Playground_Language[];
};

export default function ViewHomeQuickStartTabItem({ icon, title, languages }: Props) {
    const swiperElRef = useRef<any>(null);

    useEffect(() => {
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
                    slidesPerView: 6,
                    spaceBetween: 24,
                },
            },
        };

        Object.assign(swiperElRef.current, params);

        // initialize swiper
        swiperElRef.current.initialize();
    }, []);

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
                    <Image src={icon} alt="code icon" className={styles.languageZoneTitleIcon} />
                    <span className={styles.languageZoneTitleText}>{title}</span>
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
                <swiper-container init={false} class={styles.swiperContainer} ref={swiperElRef}>
                    {languages &&
                        languages.map((lang, index) => (
                            <swiper-slide key={index}>
                                <ItemCard language={lang} />
                            </swiper-slide>
                        ))}
                </swiper-container>
            </div>
        </>
    );
}
