import 'next-auth/index.d';

declare module 'next-auth' {
    interface Session {
        accessToken: string;
        error?: 'RefreshAccessTokenError';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        error?: 'RefreshAccessTokenError';
    }
}
