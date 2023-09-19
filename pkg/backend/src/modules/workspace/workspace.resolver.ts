import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { WorkspaceService } from "./workspace.service";
import { Workspace } from "./schema/workspace.schema";
import { UserId } from "../../decorators/user-id/user-id.decorator";
import { WorkspaceInput, WorkspaceUpdateInput } from "./dto/workspace.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { SaveWorkspaceFileInput } from "./dto/workspaceFile.input";
import { WorkspaceScatteredFileResponse } from "./dto/scatteredFile.response";
import { PaginateInput } from "../../commons/dto/paginateInfo.input";
import { GraphQLError } from "graphql/error";
import { CountWorkspaceByLanguages, UserWorkspacesResponseType } from "./dto/workspace.response";

@Resolver()
export class WorkspaceResolver {
    constructor(private readonly workspaceService: WorkspaceService) {}

    // @Query(() => UserWorkspacesResponseType, { name: "playground_getAllUserWorkspaces" })
    // @UseGuards(AuthGuard)
    // async getAllUserWorkspace(
    //     @UserId() userId: string,
    //     @Args("option", {
    //         type: () => PaginateInput,
    //         nullable: true,
    //     })
    //     options: PaginateInput,
    // ) {
    //     try {
    //         const allDocs = await this.workspaceService.findAllByUser(userId, options);
    //
    //         return {
    //             node: allDocs.docs,
    //             pageInfo: {
    //                 totalCount: allDocs.totalDocs,
    //                 currentPage: allDocs.page,
    //                 totalPage: allDocs.totalPages,
    //                 hasPrevPage: allDocs.hasPrevPage,
    //                 hasNextPage: allDocs.hasNextPage,
    //             },
    //         };
    //     } catch (e) {
    //         throw new GraphQLError(e);
    //     }
    // }
    //
    // @Query(() => UserWorkspacesResponseType, { name: "playground_getAllPublicWorkspaces" })
    // async getAllPublicWorkspace(
    //     @Args("option", {
    //         type: () => PaginateInput,
    //         nullable: true,
    //     })
    //     options: PaginateInput,
    // ) {
    //     try {
    //         const allDocs = await this.workspaceService.findAllPublicWorkspace(options);
    //
    //         return {
    //             node: allDocs.docs,
    //             pageInfo: {
    //                 totalCount: allDocs.totalDocs,
    //                 currentPage: allDocs.page,
    //                 totalPage: allDocs.totalPages,
    //                 hasPrevPage: allDocs.hasPrevPage,
    //                 hasNextPage: allDocs.hasNextPage,
    //             },
    //         };
    //     } catch (e) {
    //         throw new GraphQLError(e);
    //     }
    // }
    //
    // @Query(() => [CountWorkspaceByLanguages], { name: "playground_countPublicWorkspaceByLanguages" })
    // async countWorkspaceByLanguages() {
    //     return this.workspaceService.countPublicWorkspaceByLanguages();
    // }
    //
    // @Query(() => Workspace, { name: "playground_getWorkspaceBySlug" })
    // async getWorkspaceBySlug(@UserId() userId: string, @Args("slug") slug: string) {
    //     return this.workspaceService.findOneBySlug(userId, slug);
    // }
    //
    // @Mutation(() => Workspace, { name: "playground_createWorkspace" })
    // @UseGuards(AuthGuard)
    // async createWorkspace(@UserId() userId: string, @Args("input") input: WorkspaceInput) {
    //     return this.workspaceService.create(userId, input);
    // }
    //
    // @Mutation(() => Workspace, { name: "playground_updateWorkspace" })
    // @UseGuards(AuthGuard)
    // async updateWorkspace(@UserId() userId: string, @Args("id") id: string, @Args("input") input: WorkspaceUpdateInput) {
    //     return this.workspaceService.update(userId, id, input);
    // }
    //
    // @Mutation(() => Workspace, { name: "playground_deleteWorkspace" })
    // @UseGuards(AuthGuard)
    // async deleteWorkspace(@UserId() userId: string, @Args("id") id: string) {
    //     return this.workspaceService.delete(userId, id);
    // }
    //
    // @Mutation(() => Workspace, { name: "playground_saveWorkspace" })
    // @UseGuards(AuthGuard)
    // async saveWorkspace(@UserId() userId: string, @Args("id") id: string, @Args("input", { type: () => [SaveWorkspaceFileInput] }) input: SaveWorkspaceFileInput[]) {
    //     return this.workspaceService.saveWorkspaceFile(userId, id, input);
    // }
    //
    // @Mutation(() => Workspace, { name: "playground_deleteWorkspaceFile" })
    // @UseGuards(AuthGuard)
    // async deleteWorkspaceFile(@UserId() userId: string, @Args("id") id: string, @Args("filePath") filePath: string) {
    //     return this.workspaceService.deleteWorkspaceFile(userId, id, filePath);
    // }
    //
    // // file system
    //
    // @Query(() => WorkspaceScatteredFileResponse, { name: "playground_getScatteredWorkspaceFile" })
    // async getWorkspaceScatteredFile(@UserId() userId: string, @Args("workspaceId") id: string, @Args("filePath") filePath: string) {
    //     return this.workspaceService.getScatteredWorkspaceFile(userId, id, filePath);
    // }
    //
    // @Query(() => [WorkspaceScatteredFileResponse], { name: "playground_getScatteredWorkspaceFiles" })
    // async getWorkspaceScatteredFiles(@UserId() userId: string, @Args("workspaceId") id: string, @Args("filePath", { type: () => [String] }) filePath: string[]) {
    //     return this.workspaceService.getScatteredWorkspaceFiles(userId, id, filePath);
    // }
    //
    // @Mutation(() => String, { name: "playground_generatePreSignedUploadUrl" })
    // @UseGuards(AuthGuard)
    // async generatePreSignedUploadUrl(@Args("workspaceId") id: string, @Args("filePath") filePath: string) {
    //     return this.workspaceService.generateUploadPreSignedUrl(id, filePath);
    // }
}
