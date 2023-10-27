import { useAppDispatch, useAppSelector } from '@/stores/hook';
import { useEffect, useState } from 'react';
import mime from 'mime-types';

import styles from './index.module.scss';
import ImagePreview from '@/components/filePreview/image';
import AudioPreview from '@/components/filePreview/audioPreview';
import VideoPreview from '@/components/filePreview/video';
import { GetFileContentResponseDto } from '@/types';

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
    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice.workspaceFiles);

    const [workspaceFile, setWorkspaceFile] = useState<GetFileContentResponseDto>();
    const [fileType, setFileType] = useState<FilePreviewType>(FilePreviewType.IMAGE);

    useEffect(() => {
        const file = workspaceFiles.find((item) => item.path === path);

        if (!file) return;

        setWorkspaceFile(file);

        if (file.mimeType) {
            if (file.mimeType.includes('image/')) {
                setFileType(FilePreviewType.IMAGE);
            } else if (file.mimeType.includes('video/')) {
                setFileType(FilePreviewType.VIDEO);
            } else if (file.mimeType.includes('audio/')) {
                setFileType(FilePreviewType.AUDIO);
            } else if (file.mimeType.includes('application/pdf')) {
                setFileType(FilePreviewType.PDF);
            }
        }
    }, [workspaceFiles]);

    return (
        <div className={styles.container}>
            {workspaceFile && fileType === FilePreviewType.IMAGE && <ImagePreview file={workspaceFile} />}

            {workspaceFile && fileType === FilePreviewType.AUDIO && <AudioPreview path={workspaceFile.content} />}

            {workspaceFile && fileType === FilePreviewType.VIDEO && <VideoPreview path={workspaceFile.content} />}
        </div>
    );
}
