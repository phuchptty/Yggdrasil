import React, { ReactNode, useEffect } from 'react';
import WorkspaceHeader from '@/components/workspaceHeader';
import styles from './index.module.scss';
import ViewWorkspace from '@/views/workspace';
import { Playground_FileType, Playground_Workspace } from '@/graphql/generated/types';
import { Playground_GetWorkspaceBySlugDocument, usePlayground_SaveWorkspaceMutation } from '@/graphql/generated/playground.generated';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import apolloClient from '@/lib/apolloClientSSR';
import Head from 'next/head';
import { useAppSelector } from '@/stores/hook';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { reset as workspaceReset } from '@/stores/slices/workspace.slice';
import { reset as workspaceFileReset } from '@/stores/slices/workspaceFile.slice';

export async function getServerSideProps(context: any) {
    try {
        const session = await getServerSession(context.req, context.res, authOptions);

        const { data, error } = await apolloClient.query({
            query: Playground_GetWorkspaceBySlugDocument,
            variables: {
                slug: context.params.slug,
            },
            context: {
                headers: {
                    authorization: session ? `Bearer ${session.accessToken}` : '',
                },
            },
            fetchPolicy: 'no-cache',
        });

        if (error) {
            console.error(error);

            return {
                notFound: true,
            };
        }

        if (!data?.playground_getWorkspaceBySlug) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                data: data?.playground_getWorkspaceBySlug,
                accessToken: session?.accessToken || '',
            },
        };
    } catch (e) {
        console.error(e);

        return {
            notFound: true,
        };
    }
}

export default function WorkspacePage({ data, accessToken }: { data: Playground_Workspace; accessToken: string }) {
    const title = `${data.title} | Tek4 Playground`;

    const router = useRouter();
    const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice);
    const [messageApi, messageContext] = message.useMessage();
    const dispatch = useDispatch();

    const [saveWorkspaceMutation] = usePlayground_SaveWorkspaceMutation();

    // Save file on leave and interval
    const saveFileToServer = async () => {
        // If not logged in, do not save
        if (!accessToken) return;

        try {
            const inputs = workspaceFiles.workspaceFiles
                .filter((x) => x.fileType === Playground_FileType.Text)
                .map((file) => {
                    return {
                        _id: file._id,
                        name: file.name,
                        path: file.path,
                        content: file.content,
                    };
                });

            if (inputs.length === 0) return;

            const rsp = await saveWorkspaceMutation({
                variables: {
                    input: inputs,
                    playgroundSaveWorkspaceId: data._id,
                },
            });

            if (rsp.errors) {
                throw rsp.errors;
            }
        } catch (e) {
            console.error(e);
            messageApi.error('Failed to save workspace');
        }
    };

    const onTick = async () => {
        await saveFileToServer();

        // Clean redux store
        dispatch(workspaceReset());
        dispatch(workspaceFileReset());
    };

    useEffect(() => {
        router.events.on('routeChangeStart', onTick);
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.returnValue = '';

            onTick();
        });

        const timer = setInterval(() => {
            saveFileToServer();
        }, 60 * 1000); // a minute

        return () => {
            router.events.off('routeChangeStart', saveFileToServer);
            window.removeEventListener('beforeunload', saveFileToServer);

            clearInterval(timer);
        };
    });

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            {messageContext}

            <ViewWorkspace workspaceData={data} accessToken={accessToken} />
        </>
    );
}

WorkspacePage.getLayout = function getLayout(page: ReactNode) {
    return (
        <div className={styles.superBody}>
            <WorkspaceHeader />

            <div className={styles.mainContent}>{page}</div>
        </div>
    );
};
