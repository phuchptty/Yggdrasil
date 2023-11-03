import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { VmManagerService } from "./vm-manager.service";
import { RequestForVmBaseResponse } from "./dto/vm-manager.dto";

@Resolver(() => RequestForVmBaseResponse)
export class VmManagerResolver {
    constructor(private readonly vmManagerService: VmManagerService) {}

    @ResolveField("beaconHost", () => String)
    getBeaconHost(@Parent() vmManager: RequestForVmBaseResponse) {
        return this.vmManagerService.generateBeaconUrl(vmManager.workspaceId);
    }

    @ResolveField("execHost", () => String)
    getExecHost(@Parent() vmManager: RequestForVmBaseResponse) {
        return this.vmManagerService.generateExecUrl(vmManager.workspaceId, vmManager.podName);
    }
}
