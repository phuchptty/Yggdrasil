import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client';
import { getSession } from 'next-auth/react';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL || ''}/graphql`,
});

// @ts-ignore
const authLink = setContext(async (_, { headers }: { headers: Headers }) => {
    const session = await getSession();

    return {
        headers: {
            ...headers,
            authorization: session?.accessToken ? `Bearer ${session.accessToken}` : '',
        },
    };
});

const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'cache-only',
        },
    },
});

export default client;
