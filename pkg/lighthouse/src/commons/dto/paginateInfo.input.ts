import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsOptional, Min } from "class-validator";
import GraphQLJSON from "graphql-type-json";

@InputType("Playground_OptionInput")
export class OptionInput {
    @Field(() => [String], { nullable: true })
    id?: [string];
}

@InputType("Playground_ProfilePaginateInput")
export class PaginateInput {
    @Field({ nullable: true })
    @IsNumber()
    @Min(1)
    @IsOptional()
    page?: number;

    @Field({ nullable: true })
    @IsNumber()
    @IsOptional()
    @Min(1)
    perPage?: number;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    sort?: JSON;

    @Field({ nullable: true })
    @IsOptional()
    search?: string;

    @Field(() => GraphQLJSON, { nullable: true })
    @IsOptional()
    filter?: JSON;

    @Field(() => OptionInput, { nullable: true })
    @IsOptional()
    fields?: OptionInput;
}
