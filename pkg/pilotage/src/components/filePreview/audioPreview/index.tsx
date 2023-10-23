type Props = {
    path: string;
};

export default function AudioPreview({ path }: Props) {
    return <audio src={path} controls />;
}