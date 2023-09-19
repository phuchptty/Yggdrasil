import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { WorkspacePermission, WorkspaceStatus } from "../../../commons/enums";
import { WorkspaceFileInput } from "../../../commons/dto/workspaceFile.input";
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

    @Field(() => WorkspaceStatus, { nullable: true })
    @IsString()
    status: WorkspaceStatus;

    @Field(() => WorkspacePermission, { nullable: true })
    @IsString()
    permission: WorkspacePermission;

    // File storage
    @Field(() => [WorkspaceFileInput], { nullable: true })
    workspaceFiles: WorkspaceFileInput[];

    // Language
    @Field(() => ID, { nullable: false })
    @IsString()
    workspaceLanguage: string;
}

@InputType("Playground_WorkspaceUpdateInput")
export class WorkspaceUpdateInput extends PartialType(WorkspaceInput) {}
