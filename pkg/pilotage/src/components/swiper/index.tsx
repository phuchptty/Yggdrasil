import { ReactNode, useEffect, useRef } from 'react';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import type { SwiperSlideProps as SwiperSlidePropsBase } from 'swiper/react';

interface SwiperProps extends SwiperOptions {
    children: ReactNode;
    class?: string;
}

interface SwiperSlideProps extends SwiperSlidePropsBase {
    children: ReactNode;
}

export function Swiper(props: SwiperProps) {
    const swiperRef = useRef<any>(null);
    const { children, ...rest } = props;

    useEffect(() => {
        // Register Index web component
        register();

        // pass component props to parameters
        const params = {
            ...rest,
        };

        // Assign it to swiper element
        Object.assign(swiperRef.current, params);

        // initialize swiper
        swiperRef.current.initialize();
    }, []);

    return (
        <swiper-container class={props.class} init={false} ref={swiperRef}>
            {children}
        </swiper-container>
    );
}

export function SwiperSlide(props: SwiperSlideProps) {
    const { children, ...rest } = props;

    return <swiper-slide {...rest}>{children}</swiper-slide>;
}
