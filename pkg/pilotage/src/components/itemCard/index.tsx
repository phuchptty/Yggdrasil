import Image from 'next/image';
import { Playground_Language, Playground_WorkspacePermission } from '@/graphql/generated/types';
import styles from './index.module.scss';
import { usePlayground_CreateWorkspaceMutation } from '@/graphql/generated/playground.generated';

import languageImage from '@/assets/images/language.jpg';
import { message } from 'antd';
import { useRouter } from 'next/router';

export default function ItemCard({ language }: { language: Playground_Language }) {
    const [createWorkspaceMutation] = usePlayground_CreateWorkspaceMutation();
    const [messageApi, contextMenu] = message.useMessage();
    const router = useRouter();

    const onClick = async () => {
        // turn on loading
        // emitter.emit('loading', true);

        try {
            const { data, errors } = await createWorkspaceMutation({
                variables: {
                    input: {
                        permission: Playground_WorkspacePermission.Private,
                        workspaceLanguage: language._id,
                    },
                },
            });

            if (errors) {
                console.log(errors);
                messageApi.error('Có lỗi xảy ra!');
            }

            if (data && data.playground_createWorkspace.slug) {
                console.log(data);
                const slug = data.playground_createWorkspace.slug;

                // disable loading
                // emitter.emit('loading', false);

                // redirect to workspace
                router.push(`/workspace/${slug}`);
            }
        } catch (e) {
            console.error(e);
            // emitter.emit('loading', false);
        }
    };

    return (
        <div id="itemCard" className={styles.itemCard} onClick={onClick}>
            {contextMenu}

            <div id="itemCardContent" className={styles.itemCardContent}>
                <Image src={languageImage} className={styles.image} alt="language image" />
                <span className={styles.text}>{language.name}</span>
            </div>
        </div>
    );
}
