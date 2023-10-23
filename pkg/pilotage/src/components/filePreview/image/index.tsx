import { Image } from 'antd';

type Props = {
    path: string;
};

export default function ImagePreview({ path }: Props) {
    return <Image src={path} alt={'icon'} />;
}
