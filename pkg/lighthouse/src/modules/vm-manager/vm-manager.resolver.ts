import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { VmManagerService } from "./vm-manager.service";
import { UserId } from "../../decorators/user-id/user-id.decorator";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { VmManagerBaseResponse } from "./dto/vm-manager.dto";

@Resolver(() => VmManagerBaseResponse)
export class VmManagerResolver {
    constructor(private readonly vmManagerService: VmManagerService) {}

    @Mutation(() => VmManagerBaseResponse, { name: "Playground_RequestVmForWorkspace" })
    @UseGuards(AuthGuard)
    async requestVmForWorkspace(@UserId() userId: string, @Args("workspaceSlug", { type: () => String }) workspaceSlug: string) {
        return this.vmManagerService.requestVmForWorkspace(userId, workspaceSlug);
    }

    @ResolveField("beaconHost", () => String)
    getBeaconHost(@Parent() vmManager: VmManagerBaseResponse) {
        return this.vmManagerService.generateBeaconUrl(vmManager.workspaceId);
    }

    @ResolveField("execHost", () => String)
    getExecHost(@Parent() vmManager: VmManagerBaseResponse) {
        return this.vmManagerService.generateExecUrl(vmManager.workspaceId, vmManager.podName);
    }
}
