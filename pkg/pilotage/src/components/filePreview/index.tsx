import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { useEffect, useState } from 'react';
import { WorkspaceScatteredFileResponse } from '@/graphql/generated/types';
import mime from 'mime-types';

import styles from './index.module.scss';
import ImagePreview from '@/components/filePreview/image';
import AudioPreview from '@/components/filePreview/audioPreview';
import VideoPreview from '@/components/filePreview/video';

type Props = {
    path?: string;
};

enum FilePreviewType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    PDF = 'PDF',
}

export default function FilePreview({ path }: Props) {
    const dispatch = useAppDispatch();

    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice.workspaceFiles);

    const [workspaceFile, setWorkspaceFile] = useState<WorkspaceScatteredFileResponse>();
    const [fileType, setFileType] = useState<FilePreviewType>(FilePreviewType.IMAGE);

    useEffect(() => {
        const file = workspaceFiles.find((item) => item.path === path);

        if (!file) return;

        setWorkspaceFile(file);

        const mineType = mime.lookup(file.path);

        if (mineType) {
            if (mineType.includes('image/')) {
                setFileType(FilePreviewType.IMAGE);
            } else if (mineType.includes('video/')) {
                setFileType(FilePreviewType.VIDEO);
            } else if (mineType.includes('audio/')) {
                setFileType(FilePreviewType.AUDIO);
            } else if (mineType.includes('application/pdf')) {
                setFileType(FilePreviewType.PDF);
            }
        }
    }, []);

    return (
        <div className={styles.container}>
            {workspaceFile && fileType === FilePreviewType.IMAGE && <ImagePreview path={workspaceFile.content} />}

            {workspaceFile && fileType === FilePreviewType.AUDIO && <AudioPreview path={workspaceFile.content} />}

            {workspaceFile && fileType === FilePreviewType.VIDEO && <VideoPreview path={workspaceFile.content} />}
        </div>
    );
}
