import { Module } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { GatewayGateway } from "./gateway.gateway";
import { KcClientModule } from "../external/kc-client/kc-client.module";
import { WorkspaceModule } from "../external/workspace/workspace.module";

@Module({
    imports: [KcClientModule, WorkspaceModule],
    providers: [GatewayService, GatewayGateway],
})
export class GatewayModule {}
