import {
    Playground_LanguagesQuery,
    usePlayground_CountPublicWorkspaceByLanguagesQuery,
} from '@/graphql/generated/playground.generated';
import styles from './index.module.scss';
import ViewHomeSocialLanguageItem from '@/views/home/socialTab/languageItem';
import { Spin } from 'antd';

type Props = {
    languages: Playground_LanguagesQuery;
};

export default function ViewHomeSocialTab({ languages }: Props) {
    const aLanguages = languages.playground_languages;

    const { data: languageCountData, loading } = usePlayground_CountPublicWorkspaceByLanguagesQuery();

    const zone = [];

    for (const lang of languageCountData?.playground_countPublicWorkspaceByLanguages || []) {
        const languageData = aLanguages.find((x) => x._id === lang.languageId);

        if (languageData) {
            zone.push(
                <div key={lang.languageId}>
                    <ViewHomeSocialLanguageItem languageData={languageData} />
                </div>,
            );
        }
    }

    return <>{loading ? <Spin /> : <div className={styles.container}>{zone}</div>}</>;
}
