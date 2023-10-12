import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field } from "@nestjs/graphql";
import { Document } from "mongoose";
import { RoleEnum } from "../../../../common/enums";

@Schema({ timestamps: false })
export class User {
    @Prop()
    @Field(() => String, { nullable: false })
    _id!: string;

    @Field(() => String, { nullable: false })
    email: string;

    @Field(() => String, { nullable: false })
    username: string;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => RoleEnum, { nullable: true })
    roles: RoleEnum;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
