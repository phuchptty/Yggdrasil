export type KeyCloakUser = {
    id: string;
    createdTimestamp: number;
    username: string;
    enabled: boolean;
    totp: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    attributes?: Attributes;
    disableableCredentialTypes?: any[];
    requiredActions?: string[];
    federatedIdentities?: any[];
    notBefore?: number;
    access?: Access;
};

export type Access = {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
};

export type Attributes = {
    original_id?: string[];
};

export type KeyCloakTokenIntrospectRsp = {
    exp: number;
    iat: number;
    auth_time: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    session_state: string;
    name: string;
    given_name: string;
    family_name: string;
    preferred_username: string;
    email: string;
    email_verified: boolean;
    address: any;
    acr: string;
    "allowed-origins": string[];
    realm_access: RealmAccess;
    resource_access: ResourceAccess;
    scope: string;
    sid: string;
    client_id: string;
    username: string;
    active: boolean;
};

export type RealmAccess = {
    roles: string[];
};

export type ResourceAccess = {
    account: RealmAccess;
};
