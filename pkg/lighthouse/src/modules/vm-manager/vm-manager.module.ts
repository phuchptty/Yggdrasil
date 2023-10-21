import { Module } from "@nestjs/common";
import { VmManagerService } from "./vm-manager.service";
import { VmManagerResolver } from "./vm-manager.resolver";
import { WorkspaceModule } from "../workspace/workspace.module";
import { BullModule } from "@nestjs/bull";
import { VM_MANAGER_QUEUE_NAME } from "./vm-manager.constant";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { KubeApiModule } from "../external/kube-api/kube-api.module";

@Module({
    providers: [VmManagerService, VmManagerResolver],
    imports: [
        WorkspaceModule,
        BullModule.registerQueue({
            name: VM_MANAGER_QUEUE_NAME,
        }),
        BullBoardModule.forFeature({
            name: VM_MANAGER_QUEUE_NAME,
            adapter: BullAdapter,
        }),
        KubeApiModule,
    ],
    exports: [VmManagerService],
})
export class VmManagerModule {}
