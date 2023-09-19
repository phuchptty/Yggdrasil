import { Field, ObjectType } from "@nestjs/graphql";
import { IsNumber, Min } from "class-validator";

@ObjectType("Playground_PaginateInfo")
export class PaginateInfo {
    @Field()
    @IsNumber()
    totalCount!: number;

    @Field({ nullable: true })
    @IsNumber()
    @Min(1)
    currentPage?: number;

    @Field()
    @IsNumber()
    totalPage!: number;

    @Field({ nullable: true })
    hasPrevPage?: boolean;

    @Field({ nullable: true })
    hasNextPage?: boolean;
}
