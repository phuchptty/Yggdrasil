import { Field, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";
import { PaginateInfo } from "./paginateInfo.response";

export interface IAllResult<T> {
    nodes?: T[];
    pageInfo?: PaginateInfo;
    message?: string;
}

export function BaseAllAbstractResult<T>(classRef: Type<T>): Type<IAllResult<T>> {
    @ObjectType({ isAbstract: true })
    abstract class BaseAllResultType implements IAllResult<T> {
        @Field(() => [classRef], { nullable: true })
        nodes?: T[];

        @Field(() => PaginateInfo, { nullable: true })
        pageInfo?: PaginateInfo;

        @Field({ nullable: true })
        message?: string;
    }

    return BaseAllResultType as Type<IAllResult<T>>;
}
