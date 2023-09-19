import { registerEnumType } from "@nestjs/graphql";

export enum FileType {
    TEXT = "TEXT",
    BINARY = "BINARY",
}

registerEnumType(FileType, {
    name: "Playground_FileType",
});
