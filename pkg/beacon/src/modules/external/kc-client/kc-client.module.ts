import { Global, Module } from "@nestjs/common";
import { KcClientService } from "./kc-client.service";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
    providers: [KcClientService],
    imports: [HttpModule],
    exports: [KcClientService],
})
export class KcClientModule {}
