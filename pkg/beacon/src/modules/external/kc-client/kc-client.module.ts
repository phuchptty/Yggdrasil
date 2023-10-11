import { Module } from "@nestjs/common";
import { KcClientService } from "./kc-client.service";
import { HttpModule } from "@nestjs/axios";

@Module({
    providers: [KcClientService],
    imports: [HttpModule],
    exports: [KcClientService],
})
export class KcClientModule {}
