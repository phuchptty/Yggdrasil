import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { VmManagerService } from "./vm-manager.service";
import { UserId } from "../../decorators/user-id/user-id.decorator";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { RequestForVmBaseResponse, RequestForVmResponse } from "./dto/vm-manager.dto";

@Resolver(() => RequestForVmBaseResponse)
export class VmManagerResolver {
    constructor(private readonly vmManagerService: VmManagerService) {}

    @Mutation(() => RequestForVmResponse, { name: "Playground_requestVmForWorkspace" })
    @UseGuards(AuthGuard)
    async requestVmForWorkspace(@UserId() userId: string, @Args("workspaceSlug", { type: () => String }) workspaceSlug: string) {
        return {
            node: await this.vmManagerService.requestVmForWorkspace(userId, workspaceSlug),
        };
    }

    @Mutation(() => RequestForVmResponse, { name: "Playground_requestReCreateVM" })
    @UseGuards(AuthGuard)
    async requestReCreateVm(@UserId() userId: string, @Args("workspaceSlug", { type: () => String }) workspaceSlug: string) {
        return {
            node: await this.vmManagerService.requestReCreateVm(userId, workspaceSlug),
        };
    }

    @ResolveField("beaconHost", () => String)
    getBeaconHost(@Parent() vmManager: RequestForVmBaseResponse) {
        return this.vmManagerService.generateBeaconUrl(vmManager.workspaceId);
    }

    @ResolveField("execHost", () => String)
    getExecHost(@Parent() vmManager: RequestForVmBaseResponse) {
        return this.vmManagerService.generateExecUrl(vmManager.workspaceId, vmManager.podName);
    }
}
