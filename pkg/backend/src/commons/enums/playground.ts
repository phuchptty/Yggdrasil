import { registerEnumType } from "@nestjs/graphql";

export enum PlaygroundType {
    CODE = "CODE",
    WEB = "WEB",
}

registerEnumType(PlaygroundType, {
    name: 'Playground_PlaygroundType',
});

export enum WorkspaceStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
}

registerEnumType(WorkspaceStatus, {
    name: 'Playground_WorkspaceStatus',
});

export enum WorkspacePermission {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

registerEnumType(WorkspacePermission, {
    name: 'Playground_WorkspacePermission',
});
