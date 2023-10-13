import { Field, GraphQLISODateTime, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import paginate from "mongoose-paginate-v2";

@Schema({ timestamps: true, _id: true })
@ObjectType("Playground_Language")
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

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
}

export type LanguageDocument = Language & Document;
export const LanguageSchema = SchemaFactory.createForClass(Language);

LanguageSchema.index({ name: "text" });
LanguageSchema.plugin(paginate);
