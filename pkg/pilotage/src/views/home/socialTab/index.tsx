import { Playground_CountPublicWorkspaceByLanguagesQuery, Playground_LanguagesQuery } from '@/graphql/generated/playground.generated';
import styles from './index.module.scss';
import ViewHomeSocialLanguageItem from '@/views/home/socialTab/languageItem';

type Props = {
    languages: Playground_LanguagesQuery;
    languageCountData: Playground_CountPublicWorkspaceByLanguagesQuery['playground_countPublicWorkspaceByLanguages'];
};

export default function ViewHomeSocialTab({ languages, languageCountData }: Props) {
    const aLanguages = languages.playground_languages;

    const zone = [];

    for (const lang of languageCountData) {
        const languageData = aLanguages.find((x) => x._id === lang.languageId);

        if (languageData) {
            zone.push(
                <div key={lang.languageId}>
                    <ViewHomeSocialLanguageItem languageData={languageData} />
                </div>,
            );
        }
    }

    return (
        <>
            <div className={styles.container}>{zone}</div>
        </>
    );
}
