import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";

@Injectable()
export class KubeApiService implements OnModuleInit {
    private logger = new Logger(KubeApiService.name);

    public kubeApi: CoreV1Api;
    public kubeConfig: KubeConfig;

    onModuleInit(): any {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        this.kubeApi = kc.makeApiClient(CoreV1Api);
        this.kubeConfig = kc;

        this.logger.log("KubeApiService initialized");
    }
}
