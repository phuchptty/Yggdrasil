import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
    uri: `${process.env.NEXT_SSR_API_URL || ''}/graphql`,
});

const apolloClient = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: httpLink,
});

export default apolloClient;
