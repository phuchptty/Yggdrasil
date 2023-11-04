import React, { ReactNode } from 'react';
import WorkspaceHeader from '@/components/workspaceHeader';
import styles from './index.module.scss';
import ViewWorkspace from '@/views/workspace';
import { Playground_Workspace } from '@/graphql/generated/types';
import { Playground_GetWorkspaceBySlugDocument } from '@/graphql/generated/playground.generated';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import apolloClient from '@/lib/apolloClientSSR';
import Head from 'next/head';
import { message } from 'antd';

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

    // const workspaceFiles = useAppSelector((state) => state.workspaceFileSlice);
    const [messageApi, messageContext] = message.useMessage();

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
