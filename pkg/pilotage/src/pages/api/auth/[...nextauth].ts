import NextAuth, { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const tokenEndpoint = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID || '',
            clientSecret: process.env.KEYCLOAK_SECRET || '',
            issuer: process.env.KEYCLOAK_ISSUER,
        }),
    ],
    callbacks: {
        // @ts-ignore
        async jwt({ token, account }) {
            if (!token) {
                return token;
            }

            if (account) {
                // Save the access token and refresh token in the JWT on the initial login
                const { access_token, refresh_token, expires_at } = account;

                return {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt: expires_at,
                };
            }

            // If the access token has not expired, return it
            const { expiresAt } = token;

            if (Date.now() < expiresAt * 1000) {
                return token;
            }

            // Access token has expired, try to refresh it
            const { refreshToken } = token;

            try {
                const headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');

                const body = new URLSearchParams();
                body.append('client_id', process.env.KEYCLOAK_ID || '');
                body.append('client_secret', process.env.KEYCLOAK_SECRET || '');
                body.append('grant_type', 'refresh_token');
                body.append('refresh_token', refreshToken);

                const requestOptions = {
                    method: 'POST',
                    headers,
                    body,
                };

                const response = await fetch(tokenEndpoint, requestOptions);
                const { access_token, expires_in, refresh_token } = await response.json();

                return {
                    accessToken: access_token,
                    refreshToken: refreshToken || refresh_token,
                    expiresAt: Math.floor(Date.now() / 1000 + expires_in),
                };
            } catch (e) {
                console.error('Failed to refresh access token: ', e);

                return {
                    ...token,
                    error: 'RefreshAccessTokenError',
                };
            }
        },
        async session({ session, token }) {
            session.error = token?.error;
            session.accessToken = token?.accessToken;

            return session;
        },
    },
};

export default NextAuth(authOptions);
