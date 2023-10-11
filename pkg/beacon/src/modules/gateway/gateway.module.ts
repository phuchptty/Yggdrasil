import { Module } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { GatewayGateway } from "./gateway.gateway";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { KcClientModule } from "../external/kc-client/kc-client.module";

@Module({
    imports: [KcClientModule],
    providers: [
        GatewayService,
        GatewayGateway,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class GatewayModule {}
