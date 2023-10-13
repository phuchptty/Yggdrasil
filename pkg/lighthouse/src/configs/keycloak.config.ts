export const keycloakConfig = () => ({
    keycloak: {
        baseUrl: process.env.KEYCLOAK_BASE || "",
        realm: process.env.KEYCLOAK_REALM || "",
        clientId: process.env.KEYCLOAK_CLIENT_ID || "",
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
        auth: {
            clientId: process.env.KEYCLOAK_AUTH_CLIENT_ID || "",
            clientSecret: process.env.KEYCLOAK_AUTH_CLIENT_SECRET || "",
        },
    },
});
