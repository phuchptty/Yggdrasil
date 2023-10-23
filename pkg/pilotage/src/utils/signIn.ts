import { signIn } from 'next-auth/react';

export function doLogin() {
    return signIn('keycloak', undefined, {
        prompt: 'login',
        grant_type: 'refresh_token',
    });
}
