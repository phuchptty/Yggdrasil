import { Button, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import Image from 'next/image';
import MonacoEditor from '@/components/monacoEditor';
import type { Tab } from 'rc-tabs/lib/interface';
import styles from './index.module.scss';
import playIcon from '@/assets/icons/workspace/el_play.svg';
import reloadIcon from '@/assets/icons/workspace/mdi_reload.svg';
import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { closeFile, setCurrentFile } from '@/stores/slices/workspaceFile.slice';
import FilePreview from '@/components/filePreview';
import { FileState } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Socket } from 'socket.io-client';

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    'data-node-key': string;
}

const DraggableTabNode = ({ className, ...props }: DraggableTabPaneProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props['data-node-key'],
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleX: 1 }),
        transition,
        cursor: 'move',
    };

    return React.cloneElement(props.children as React.ReactElement, {
        ref: setNodeRef,
        style,
        ...attributes,
        ...listeners,
    });
};

type Props = {
    onRunClick: () => void;
    isExecuting: boolean;
    beaconSocket?: Socket;
};

export default function EditorColumn({ onRunClick, isExecuting, beaconSocket }: Props) {
    const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });
    const dispatch = useAppDispatch();

    const [activeKey, setActiveKey] = useState<string>('');
    const [items, setItems] = useState<Tab[]>([]);

    const workspaceFileOpen = useAppSelector((state) => state.workspaceFileSlice);
    const workspaceData = useAppSelector((state) => state.workspaceSlice);

    // watch for workspaceFileOpen change
    useEffect(() => {
        if (workspaceFileOpen.openFiles.length > 0) {
            const items = workspaceFileOpen.openFiles.flatMap((file) => {
                const fileData = workspaceFileOpen.workspaceFiles.find((f) => f.path === file.path);

                if (!fileData) {
                    return [];
                }

                return {
                    key: fileData.path,
                    label: (
                        <>
                            {file.state === FileState.OPENED && <p className="italic">{fileData.name}</p>}
                            {file.state === FileState.CHANGED && (
                                <p className="display--flex align-items--center">
                                    <FontAwesomeIcon icon={faCircle} color="#ffffff" size="xs" />
                                    <span className="ml--6">{fileData.name}</span>
                                </p>
                            )}
                            {file.state === FileState.SAVED && <p>{fileData.name}</p>}
                        </>
                    ),
                    children:
                        !fileData.mimeType.startsWith('image') ||
                        !fileData.mimeType.startsWith('video') ||
                        !fileData.mimeType.startsWith('audio') ||
                        fileData.mimeType !== 'application/octet-stream' ? (
                            <MonacoEditor key={fileData.path} path={fileData.path} beaconSocket={beaconSocket} />
                        ) : (
                            <FilePreview key={fileData.path} path={fileData.path} />
                        ),
                };
            });

            setItems(items);
            setActiveKey(items.length >= 0 ? items[items.length - 1].key : '');
        } else {
            setItems([
                {
                    key: 'templateGettingStarted',
                    label: 'Bắt đầu',
                    children: <MonacoEditor />,
                },
            ]);
            setActiveKey('templateGettingStarted');
        }
    }, [workspaceFileOpen.openFiles]);

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setItems((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const onChange = (key: string) => {
        setActiveKey(key);
        dispatch(setCurrentFile(key));
    };

    const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'remove') {
            dispatch(closeFile(targetKey as string));
        }
    };

    const tabBarExtra = (
        <div className={styles.tabBarExtra}>
            {workspaceData.workspaceLanguage && <Button icon={<Image src={reloadIcon} alt={'reloadIcon'} />} className={styles.reloadBtn} />}

            <Button icon={<Image src={playIcon} alt={'playIcon'} />} loading={isExecuting} className={styles.runBtn} onClick={onRunClick} />
        </div>
    );

    return (
        <>
            <Tabs
                renderTabBar={(tabBarProps, DefaultTabBar) => (
                    <DndContext sensors={[sensor]} onDragEnd={onDragEnd} id={'dndContext'}>
                        <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
                            <DefaultTabBar {...tabBarProps} className={'w--full'}>
                                {(node) => (
                                    <DraggableTabNode {...node.props} key={node.key}>
                                        {node}
                                    </DraggableTabNode>
                                )}
                            </DefaultTabBar>
                        </SortableContext>
                    </DndContext>
                )}
                type="editable-card"
                activeKey={activeKey}
                onEdit={onEdit}
                onChange={onChange}
                items={items}
                hideAdd
                tabBarStyle={{
                    backgroundColor: '#191C26',
                    paddingTop: 8,
                    height: '3.4375rem',
                    marginBottom: 0,
                }}
                tabBarExtraContent={tabBarExtra}
                className={styles.tabContent}
            />
        </>
    );
}
