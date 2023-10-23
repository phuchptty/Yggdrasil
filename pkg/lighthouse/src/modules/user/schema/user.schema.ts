import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field, ObjectType } from "@nestjs/graphql";
import { RoleEnum } from "../../../commons/enums";
import { Schema as MongooseSchema, Document } from "mongoose";
import { BSON } from "mongodb";

@Schema({ timestamps: false, _id: false })
@ObjectType("Profile_User", { description: "The user model" })
export class User {
    @Field(() => String, { nullable: false })
    @Prop({ required: true, type: MongooseSchema.Types.UUID })
    _id!: BSON.UUID;

    @Field(() => String, { nullable: false })
    email: string;

    @Field(() => String, { nullable: false })
    username: string;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => [RoleEnum], { nullable: true })
    roles: RoleEnum[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
