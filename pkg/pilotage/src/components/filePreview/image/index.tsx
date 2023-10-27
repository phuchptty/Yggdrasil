import { Image } from 'antd';
import { GetFileContentResponseDto } from '@/types';

type Props = {
    file: GetFileContentResponseDto;
};

export default function ImagePreview({ file }: Props) {
    return <Image src={`data:${file.mimeType};base64,${file.content}`} alt={'preview'} />;
}
