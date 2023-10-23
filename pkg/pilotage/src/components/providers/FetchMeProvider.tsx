import { PropsWithChildren, useEffect } from 'react';
import { useProfile_MeQuery } from '@/graphql/generated/profile.generated';
import { useAppDispatch } from '@/stores/hook';
import { setUserData, setIsLogin } from '@/stores/slices/auth.slice';

export default function FetchMeProvider({ children }: PropsWithChildren) {
    const { error, data } = useProfile_MeQuery({
        ssr: false,
    });

    const dispatch = useAppDispatch();

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        if (data) {
            dispatch(setUserData(data.Profile_me));
            dispatch(setIsLogin(true));
        }
    }, [data]);

    return <>{children}</>;
}
