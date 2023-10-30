import { Module } from "@nestjs/common";
import { KcClientService } from "./kc-client.service";
import { HttpModule } from "@nestjs/axios";
import { RedisModule } from "../../redis/redis.module";

@Module({
    providers: [KcClientService],
    imports: [HttpModule, RedisModule],
    exports: [KcClientService],
})
export class KcClientModule {}
