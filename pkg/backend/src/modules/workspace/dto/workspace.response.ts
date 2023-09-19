import { Field, ObjectType } from "@nestjs/graphql";
import { Workspace } from "../schema/workspace.schema";
import { PaginateInfo } from "../../../commons/dto/paginateInfo.response";

@ObjectType("Playgrounds_UserWorkspaces")
export class UserWorkspacesResponseType {
    @Field(() => [Workspace], { nullable: true })
    node: Workspace[];

    @Field(() => PaginateInfo, { nullable: true })
    pageInfo?: PaginateInfo;
}

@ObjectType("Playgrounds_CountWorkspaceByLanguages")
export class CountWorkspaceByLanguages {
    @Field(() => String)
    languageId: string;

    @Field(() => Number, { defaultValue: 0 })
    count: number;
}
