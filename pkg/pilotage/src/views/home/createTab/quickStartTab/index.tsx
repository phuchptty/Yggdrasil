import ViewHomeQuickStartTabItem from '@/views/home/createTab/quickStartTab/item';
import { Playground_LanguagesQuery } from '@/graphql/generated/playground.generated';

import styles from './index.module.scss';
import languageIcon from '@/assets/icons/home/mingcute_code-line.svg';
import sandboxIcon from '@/assets/icons/home/pepicons-print_internet.svg';
import templateIcon from '@/assets/icons/home/copy.svg';

export default function ViewHomeQuickStartTab({ languages }: { languages: Playground_LanguagesQuery }) {
    return (
        <div className={styles.zone}>
            <div id="languageZone">
                <ViewHomeQuickStartTabItem icon={languageIcon} title={'Ngôn ngữ'} languages={languages?.playground_languages || []} />
            </div>

            {/*<div id="templateZone">*/}
            {/*    <ViewHomeQuickStartTabItem icon={templateIcon} title={'Mẫu có sẵn'} />*/}
            {/*</div>*/}
        </div>
    );
}
