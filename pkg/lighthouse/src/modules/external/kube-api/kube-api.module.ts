import { Module } from "@nestjs/common";
import { KubeApiService } from "./kube-api.service";

@Module({
    providers: [KubeApiService],
    exports: [KubeApiService],
})
export class KubeApiModule {}
