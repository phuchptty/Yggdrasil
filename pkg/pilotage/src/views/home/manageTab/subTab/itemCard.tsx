import { Playground_Workspace, Playground_WorkspaceStatus } from '@/graphql/generated/types';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Dropdown, message, Modal } from 'antd';
import type { MenuProps } from 'antd';

import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';

import styles from './index.module.scss';
import moreIcon from '@/assets/icons/home/More_Vertical.svg';
import workspacePreview from '@/assets/images/workspacePreview.png';
import urlJoin from 'url-join';
import { MittEvent, useMitt } from '@/lib/mitt';
import { usePlayground_DeleteWorkspaceMutation } from '@/graphql/generated/playground.generated';

dayjs.extend(relativeTime);

enum MenuItem {
    COPY_LINK = 'COPY_LINK',
    RENAME = 'RENAME',
    DELETE = 'DELETE',
}

export default function ItemCard({ data }: { data: Partial<Playground_Workspace> }) {
    const [messageApi, messageContext] = message.useMessage();
    const { emitter } = useMitt();
    const [deleteWorkspaceMutation] = usePlayground_DeleteWorkspaceMutation();
    const [modal, contextHolder] = Modal.useModal();

    const dropDownItems: MenuProps['items'] = [
        {
            key: MenuItem.COPY_LINK,
            label: 'Copy link',
        },
        {
            key: MenuItem.RENAME,
            label: 'Đổi tên file',
        },
        {
            type: 'divider',
        },
        {
            key: MenuItem.DELETE,
            danger: true,
            label: 'Xoá',
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

    const deleteWorkspace = async () => {
        modal.confirm({
            title: 'Bạn có chắc muốn xoá Workspace này?',
            content: 'Xoá Workspace sẽ không thể khôi phục lại được',
            okText: 'Xoá',
            cancelText: 'Huỷ',
            onOk: async () => {
                if (!data._id) return;

                try {
                    const { data: rspData, errors } = await deleteWorkspaceMutation({
                        variables: {
                            playgroundDeleteWorkspaceId: data._id,
                        },
                    });

                    if (errors) {
                        console.error(errors);
                        messageApi.error(errors[0].message);
                        return;
                    }

                    if (data) {
                        messageApi.success('Xoá Workspace thành công');

                        // Send event to modal by event bus
                        emitter.emit(MittEvent.HOME_REFETCH_WORKSPACE);
                    }
                } catch (e) {
                    console.error(e);
                    messageApi.error('Có lỗi xảy ra');
                }
            },
        });
    };

    const onClick: MenuProps['onClick'] = ({ key }) => {
        console.info(`Click on item ${key}`);

        switch (key) {
            case MenuItem.COPY_LINK:
                copyLink();
                break;
            case MenuItem.RENAME:
                renameWorkspace();
                break;
            case MenuItem.DELETE:
                deleteWorkspace();
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
                    <p title={data.updatedAt}>{dayjs(data.updatedAt).fromNow()}</p>
                    <p>{data.status === Playground_WorkspaceStatus.Published ? 'Xuất bản' : 'Nháp'}</p>
                </div>
            </div>
        </div>
    );
}
