import { registerEnumType } from "@nestjs/graphql";

export enum WorkspacePermission {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

registerEnumType(WorkspacePermission, {
    name: "Playground_WorkspacePermission",
});
