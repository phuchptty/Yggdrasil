import styles from './index.module.scss';
import { Button, Input, message, Modal, Space, Table, Tooltip } from 'antd';
import { CopyOutlined, DeleteOutlined, PlusSquareOutlined, ReloadOutlined } from '@ant-design/icons';
import * as React from 'react';
import { Socket } from 'socket.io-client';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { LighthouseEvent } from '@/constants/lighthouseEvent';
import { GetListPortForwardResponse, PortForwardData } from '@/types/lighthouseSocket.type';

type Props = {
    lighthouseSocket: Socket | undefined;
    vmData: any;
};

export default function InfoColPortForward({ lighthouseSocket, vmData }: Props) {
    // Api
    const [messageApi, messageContext] = message.useMessage();
    const [modalApi, modalContext] = Modal.useModal();

    // Table settings
    const columns: ColumnsType<any> = [
        {
            title: 'Cổng',
            dataIndex: 'port',
            key: 'port',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (text, record: PortForwardData) => {
                return (
                    <Space>
                        <Tooltip title="Copy đường dẫn" placement={'bottom'} arrow={false}>
                            <Button type={'default'} icon={<CopyOutlined />} onClick={() => copyDomain(record.domain)}></Button>
                        </Tooltip>

                        <Tooltip title="Xóa" placement={'bottom'} arrow={false}>
                            <Button type={'default'} danger icon={<DeleteOutlined />} onClick={() => deletePort(record.port)}></Button>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    const copyDomain = (domain: string) => {
        navigator.clipboard.writeText(domain).then(
            function () {
                messageApi.success('Đã copy đường dẫn');
            },
            function () {
                messageApi.error('Không thể copy đường dẫn');
            },
        );
    };

    const deletePort = (port: number) => {
        if (!lighthouseSocket) {
            messageApi.error('[Lighthouse] No connection to the server');
            return;
        }

        modalApi.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn xóa?',
            okText: 'Xóa',
            cancelText: 'Huỷ bỏ',
            onOk: () => {
                lighthouseSocket.emit(
                    LighthouseEvent.DELETE_PORT_FORWARD,
                    {
                        workspaceId: vmData.workspaceId,
                        podName: vmData.podName,
                        port: port,
                    },
                    () => {
                        lighthouseSocket.emit(
                            LighthouseEvent.GET_LIST_PORT_FORWARD,
                            {
                                workspaceId: vmData.workspaceId,
                                podName: vmData.podName,
                            },
                            (data: GetListPortForwardResponse) => {
                                setPortData(data.ports);
                            },
                        );
                    },
                );
            },
        });
    };

    // States
    const [portData, setPortData] = React.useState<PortForwardData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newPort, setNewPort] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isReloading, setIsReloading] = useState<boolean>(false);

    useEffect(() => {
        if (!lighthouseSocket) return;
        if (!vmData) return;

        setIsLoading(true);

        lighthouseSocket.emit(
            LighthouseEvent.GET_LIST_PORT_FORWARD,
            {
                workspaceId: vmData.workspaceId,
                podName: vmData.podName,
            },
            (data: GetListPortForwardResponse) => {
                setPortData(data.ports);

                setIsLoading(false);
            },
        );
    }, [lighthouseSocket, vmData]);

    const reloadPort = () => {
        if (!lighthouseSocket) {
            messageApi.error('[Lighthouse] No connection to the server');
            return;
        }

        setIsReloading(true);

        lighthouseSocket.emit(
            LighthouseEvent.GET_LIST_PORT_FORWARD,
            {
                workspaceId: vmData.workspaceId,
                podName: vmData.podName,
            },
            (data: GetListPortForwardResponse) => {
                setPortData(data.ports);
                setIsReloading(false);
            },
        );
    };

    const openPort = () => {
        if (!lighthouseSocket) {
            messageApi.error('[Lighthouse] No connection to the server');
            return;
        }

        if (!newPort || isNaN(Number(newPort))) {
            messageApi.error('Tham số lỗi');
            return;
        }

        lighthouseSocket.emit(
            LighthouseEvent.REQUEST_PORT_FORWARD,
            {
                workspaceId: vmData.workspaceId,
                podName: vmData.podName,
                port: newPort,
            },
            () => {
                lighthouseSocket.emit(
                    LighthouseEvent.GET_LIST_PORT_FORWARD,
                    {
                        workspaceId: vmData.workspaceId,
                        podName: vmData.podName,
                    },
                    (data: GetListPortForwardResponse) => {
                        setPortData(data.ports);
                    },
                );

                setIsModalOpen(false);
            },
        );
    };

    return (
        <div className={styles.container}>
            {messageContext}
            {modalContext}

            <div className={styles.columnHeader}>
                <div className={styles.columnHeaderContent}>
                    <div className={`display--flex flex-direction--row ${styles.gap}`}>
                        <p className={styles.columnTitle}>Port Forwarding</p>
                    </div>

                    <div className={styles.headerDiv}>
                        <Tooltip title="Tải lại" placement={'bottom'} arrow={false}>
                            <Button type={'default'} icon={<ReloadOutlined />} onClick={() => reloadPort()} loading={isReloading}></Button>
                        </Tooltip>

                        <Tooltip title="Tạo mới" placement={'bottom'} arrow={false}>
                            <Button type={'default'} icon={<PlusSquareOutlined />} onClick={() => setIsModalOpen(true)}></Button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className={styles.realContainer}>
                <Table columns={columns} dataSource={portData} pagination={false} loading={isLoading} />
            </div>

            <Modal
                title="Thêm file mới"
                className={styles.addNewFileModal}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={openPort}
                cancelText="Huỷ bỏ"
            >
                <Input placeholder="Mở cổng" className="mt--2" value={newPort} onChange={(e) => setNewPort(Number(e.target.value))} />
            </Modal>
        </div>
    );
}
