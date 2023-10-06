import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { WorkspacePermission } from "../../../commons/enums";
import { IsString } from "class-validator";

@InputType("Playground_WorkspaceInput")
export class WorkspaceInput {
    @Field(() => String, { nullable: true })
    @IsString()
    title?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    slug: string;

    @Field(() => String, { nullable: true })
    @IsString()
    description?: string;

    @Field(() => WorkspacePermission, { nullable: true })
    @IsString()
    permission: WorkspacePermission;

    // Language
    @Field(() => ID, { nullable: false })
    @IsString()
    workspaceLanguage: string;
}

@InputType("Playground_WorkspaceUpdateInput")
export class WorkspaceUpdateInput extends PartialType(WorkspaceInput) {}
