import { registerEnumType } from "@nestjs/graphql";

export enum RoleEnum {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}

registerEnumType(RoleEnum, {
    name: "RoleEnum",
});
