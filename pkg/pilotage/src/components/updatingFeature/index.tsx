import Image from 'next/image';
import updatingFeatureBg from '@/assets/images/updatingFeatureBg.svg';

export default function UpdatingFeature() {
    return (
        <div className={`display--flex justify-content--center align-items--center mt--16`}>
            <Image src={updatingFeatureBg} alt={'updating feature'} />
        </div>
    );
}
