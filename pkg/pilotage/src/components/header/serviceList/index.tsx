import React from 'react';
import { notification } from 'antd';
import CustomTooltip from '@/components/header/tooltip';
import Image from 'next/image';

import courseIcon from '@/assets/icons/home/course.svg';
import newIcon from '@/assets/icons/home/news2.svg';
import jobIcon from '@/assets/icons/home/job.svg';
import marketIcon from '@/assets/icons/home/market.svg';
import newFeedIcon from '@/assets/icons/home/newfeed.svg';
import warningNoti from '@/assets/icons/warning-noti.svg';

export default function Tek4ServiceList() {
    const [notificationApi, contextHolder] = notification.useNotification();

    const openNotification = () => {
        notificationApi.info({
            message: <div style={{ color: '#fff', fontWeight: '600' }}>Thông báo</div>,
            description: 'Chức năng đang trong quá trình phát triển!',
            placement: 'bottomLeft',
            icon: (
                <Image
                    src={warningNoti}
                    width={24}
                    height={24}
                    alt="Warning icon"
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                    }}
                />
            ),
            style: {
                borderRadius: 8,
                border: '1px solid #FFA500',
            },
        });
    };

    return (
        <>
            {contextHolder}

            <CustomTooltip title="Học tập" href="https://tek4.vn/hoc-tap" target="_blank">
                <Image src={courseIcon} alt="TEK4.VN-icon" width={24} height={24} />
            </CustomTooltip>

            <CustomTooltip title="Tin tức" href="https://tek4.vn/cong-dong" target="_blank">
                <Image src={newIcon} alt="TEK4.VN-icon" width={25} height={24} />
            </CustomTooltip>

            <CustomTooltip title="Jobs" onClick={openNotification}>
                <Image src={jobIcon} alt="TEK4.VN-icon" width={24} height={24} />
            </CustomTooltip>

            <CustomTooltip title="Chợ" onClick={openNotification}>
                <Image src={marketIcon} alt="TEK4.VN-icon" width={24} height={24} />
            </CustomTooltip>

            <CustomTooltip title="Newfeed" onClick={openNotification}>
                <Image src={newFeedIcon} alt="TEK4.VN-icon" width={24} height={24} />
            </CustomTooltip>
        </>
    );
}
