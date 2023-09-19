import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import k8s from "@kubernetes/client-node";

@Injectable()
export class KubeApiService implements OnModuleInit {
    private logger = new Logger(KubeApiService.name);

    public kubeApi: k8s.CoreV1Api;
    public kubeConfig: k8s.KubeConfig;

    onModuleInit(): any {
        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();

        this.kubeApi = kc.makeApiClient(k8s.CoreV1Api);
        this.kubeConfig = kc;

        this.logger.debug("KubeApiService initialized");
    }
}
