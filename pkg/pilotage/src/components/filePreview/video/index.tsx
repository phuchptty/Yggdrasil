type Props = {
    path?: string;
};

export default function VideoPreview({ path }: Props) {
    return <video controls autoPlay src={path}></video>;
}
