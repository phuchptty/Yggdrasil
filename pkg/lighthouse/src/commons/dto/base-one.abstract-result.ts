import { Field, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";

export interface IOneResult<T> {
    node?: T;
    message?: string;
}

export function BaseOneAbstractResult<T>(classRef: Type<T>): Type<IOneResult<T>> {
    @ObjectType({ isAbstract: true })
    abstract class BaseOneResultType implements IOneResult<T> {
        @Field(() => classRef, { nullable: true })
        node?: T;

        @Field({ nullable: true })
        message?: string;
    }

    return BaseOneResultType as Type<IOneResult<T>>;
}
