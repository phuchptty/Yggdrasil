import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Schema as MongooseSchema } from "mongoose";
import { generateUUID } from "../../utils/uuid";

@Schema({ timestamps: false })
@ObjectType("Playground_WorkspaceFileMetadata")
export class WorkspaceFileMetadata {
    @Field(() => String, { nullable: true })
    @Prop({ required: true })
    mimeType: string;

    @Field(() => String, { nullable: true })
    @Prop({ default: 0 })
    fileSize: number;

    @Field(() => String, { nullable: true })
    @Prop()
    etag?: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    @Prop()
    lastModified?: Date;
}

@Schema({ timestamps: true, _id: true })
@ObjectType("Playground_WorkspaceFile")
export class WorkspaceFile {
    @Field(() => ID, { nullable: false })
    @Prop({ required: true, type: MongooseSchema.Types.UUID, default: generateUUID() })
    _id: string;

    @Prop({ required: true })
    @Field(() => String, { nullable: false })
    name: string;

    @Prop({ required: true })
    @Field(() => String, { nullable: false })
    path: string;

    @Prop({ required: true })
    @Field(() => String, { nullable: false })
    s3Path: string;

    @Prop()
    @Field(() => WorkspaceFileMetadata, { nullable: true })
    metadata?: WorkspaceFileMetadata;
}

export const WorkspaceFileSchema = SchemaFactory.createForClass(WorkspaceFile);
