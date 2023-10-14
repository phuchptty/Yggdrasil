import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { VmManagerService } from "./vm-manager.service";
import { UserId } from "../../decorators/user-id/user-id.decorator";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth/auth.guard";

@Resolver()
export class VmManagerResolver {
    constructor(private readonly vmManagerService: VmManagerService) {}

    @Mutation(() => Boolean, { name: "Playground_RequestVmForWorkspace" })
    @UseGuards(AuthGuard)
    async requestVmForWorkspace(@UserId() userId: string, @Args("workspaceSlug", { type: () => String }) workspaceSlug: string) {
        await this.vmManagerService.requestVmForWorkspace(userId, workspaceSlug);

        return true;
    }
}
