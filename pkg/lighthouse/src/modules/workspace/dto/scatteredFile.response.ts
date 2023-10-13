import { Field, ID, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { FileType } from "../../../commons/enums";

@ObjectType()
export class WorkspaceScatteredFileResponse {
    @Field(() => ID)
    _id: string;

    @Field()
    name: string;

    @Field()
    path: string;

    @Field()
    content: string;

    @Field()
    size: number;

    @Field()
    actualSize: number;

    @Field(() => GraphQLJSON)
    metaData?: JSON;

    @Field(() => FileType)
    fileType: FileType;
}
