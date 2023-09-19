import { WorkspacePermission, WorkspaceStatus } from "../../../commons/enums";
import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { generateSlug } from "random-word-slugs";
import dayjs from "dayjs";
import { Language } from "../../language/schema/language.schema";
import { User, UserSchema } from "../../user/schema/user.schema";

@Schema({ timestamps: true, _id: true })
@ObjectType("Playground_Workspace")
export class Workspace {
    @Field(() => ID, { nullable: false })
    _id!: string;

    @Prop({ required: true, type: UserSchema })
    @Field(() => User, { nullable: false })
    owner: User;

    @Field(() => String, { nullable: false })
    @Prop({ required: false }) // false because auto generated if not provided
    title: string;

    @Field(() => String, { nullable: true })
    @Prop({ required: false, unique: true })
    slug: string;

    @Field(() => String, { nullable: true })
    @Prop()
    description?: string;

    @Field(() => WorkspaceStatus, { nullable: false })
    @Prop({ required: true, type: String, enum: WorkspaceStatus, default: WorkspaceStatus.DRAFT })
    status: WorkspaceStatus;

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
}

export type WorkspaceDocument = Workspace & Document;
export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

WorkspaceSchema.index({ title: "text" });
WorkspaceSchema.plugin(paginate);

WorkspaceSchema.pre("save", async function (next) {
    if (!this.slug) {
        const words = generateSlug(3, {
            format: "kebab",
        });

        const timestamp = dayjs().unix();

        this.slug = `${words}-${timestamp}`;
    }

    if (!this.title) {
        this.title = this.slug;
    }

    next();
});
