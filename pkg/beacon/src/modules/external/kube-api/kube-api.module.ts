import { Global, Module } from "@nestjs/common";
import { KubeApiService } from "./kube-api.service";

@Global()
@Module({
    providers: [KubeApiService],
    exports: [KubeApiService],
})
export class KubeApiModule {}
