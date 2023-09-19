import { Directive, Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import paginate from "mongoose-paginate-v2";
import { PlaygroundType } from "../../../commons/enums";

@Schema({ timestamps: true, _id: true })
@ObjectType("Playground_Language")
@Directive('@key(fields: "_id")')
@Directive("@shareable")
export class Language {
    @Field(() => ID, { nullable: false })
    _id!: string;

    @Field(() => String, { nullable: false })
    @Prop({ required: true })
    name!: string;

    @Field(() => String, { nullable: false })
    @Prop({ required: true })
    key!: string;

    @Field(() => String, { nullable: false })
    @Prop({ required: true })
    editorKey!: string;

    @Field(() => PlaygroundType, { nullable: false })
    @Prop({ type: String, enum: PlaygroundType, default: PlaygroundType.CODE })
    playgroundType!: PlaygroundType;

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
}

export type LanguageDocument = Language & Document;
export const LanguageSchema = SchemaFactory.createForClass(Language);

LanguageSchema.index({ name: "text" });
LanguageSchema.plugin(paginate);
