import { Playground_Workspace, Playground_WorkspaceStatus } from '@/graphql/generated/types';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Avatar, Dropdown, message, Modal } from 'antd';
import type { MenuProps } from 'antd';

import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';

import styles from './index.module.scss';
import moreIcon from '@/assets/icons/home/More_Vertical.svg';
import workspacePreview from '@/assets/images/workspacePreview.png';
import urlJoin from 'url-join';
import { MittEvent, useMitt } from '@/lib/mitt';

dayjs.extend(relativeTime);

enum MenuItem {
    COPY_LINK = 'COPY_LINK',
}

type Props = {
    data: Playground_Workspace;
};

export default function SocialTabItemCard({ data }: Props) {
    const [messageApi, messageContext] = message.useMessage();
    const { emitter } = useMitt();
    const [modal, contextHolder] = Modal.useModal();

    const dropDownItems: MenuProps['items'] = [
        {
            key: MenuItem.COPY_LINK,
            label: 'Copy link',
        },
    ];

    const copyLink = async () => {
        try {
            const url = urlJoin(window.location.origin, `workspace`, `${data.slug}`);
            await navigator.clipboard.writeText(url);
        } catch (error) {
            console.error(error);
            messageApi.error('Không thể copy link');
        }
    };

    const renameWorkspace = () => {
        // Send event to modal by event bus
        emitter.emit(MittEvent.HOME_CHANGE_WORKSPACE_TITLE_MODAL_VISIBLE, true);
        emitter.emit(MittEvent.HOME_CHANGE_WORKSPACE_DATA, data);
    };

    const onClick: MenuProps['onClick'] = ({ key }) => {
        console.info(`Click on item ${key}`);

        switch (key) {
            case MenuItem.COPY_LINK:
                copyLink();
                break;
        }
    };

    return (
        <div className={styles.itemCard}>
            {messageContext}
            {contextHolder}

            <div>
                <Link href={`/workspace/${data.slug}`}>
                    <Image className={styles.cover} alt="workspacePreview" src={workspacePreview} />
                </Link>
            </div>

            <div className={'display--flex justify-content--spaceBetween flex-direction--column h--full'}>
                <div className={styles.titleZone}>
                    <Link href={`/workspace/${data.slug}`} className={styles.cardLink}>
                        <p className={styles.cardText}>{data.title}</p>
                    </Link>

                    <Dropdown menu={{ items: dropDownItems, onClick }} trigger={['click']} overlayClassName={styles.dropdown}>
                        <Image src={moreIcon} alt={'context menu'} className={styles.moreIcon} />
                    </Dropdown>
                </div>

                <div className={styles.subTitleZone}>
                    <div className={styles.userZone}>
                        <Avatar src={data.owner.avatar?.downloadUrl || 'https://tek4.vn/images/default-user-avatar.png'} size={36} />
                        <p>{data?.owner.name}</p>
                    </div>

                    <div></div>
                </div>
            </div>
        </div>
    );
}
