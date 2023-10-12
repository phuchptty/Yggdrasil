import { Field, GraphQLISODateTime } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Language } from "./language.schema";
import { User, UserSchema } from "./user.schema";
import { WorkspacePermission } from "../../../../common/enums";

@Schema({ timestamps: true, _id: true })
export class Workspace {
    @Prop({ required: true, type: UserSchema })
    owner: User;

    @Field(() => String, { nullable: false })
    title: string;

    @Field(() => String, { nullable: true })
    @Prop({ required: false, unique: true })
    slug: string;

    @Field(() => String, { nullable: true })
    @Prop()
    description?: string;

    @Field(() => WorkspacePermission, { nullable: false })
    @Prop({ required: true, type: String, enum: WorkspacePermission, default: WorkspacePermission.PRIVATE })
    permission: WorkspacePermission;

    // Language
    @Field(() => Language, { nullable: false })
    @Prop({ required: true, type: Types.ObjectId, ref: Language.name })
    workspaceLanguage: Types.ObjectId;

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt: Date;

    @Field(() => String, { nullable: true })
    beaconHost?: string;
}

export type WorkspaceDocument = Workspace & Document;
export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

WorkspaceSchema.index({ title: "text" });
