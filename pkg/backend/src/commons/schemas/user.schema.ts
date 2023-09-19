import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field, ObjectType } from "@nestjs/graphql";

@Schema({ timestamps: false })
@ObjectType("Profile_Base_User", { description: "The user model" })
export class User {
    @Prop()
    @Field(() => String, { nullable: false })
    _id!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
