import { Field, GraphQLISODateTime, ID, InputType } from "@nestjs/graphql";

@InputType("Playground_WorkspaceFileMetadataInput")
export class WorkspaceFileMetadataInput {
    @Field(() => String, { nullable: false })
    mimeType: string;

    @Field(() => String, { nullable: true })
    fileSize: number;

    @Field(() => String, { nullable: true })
    etag?: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    lastModified?: Date;
}

@InputType("Playground_WorkspaceFileInput")
export class WorkspaceFileInput {
    @Field(() => ID, { nullable: true })
    _id?: string;

    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String, { nullable: false })
    path: string;

    @Field(() => String, { nullable: false })
    s3Path: string;

    @Field(() => WorkspaceFileMetadataInput, { nullable: true })
    metadata?: WorkspaceFileMetadataInput;
}
