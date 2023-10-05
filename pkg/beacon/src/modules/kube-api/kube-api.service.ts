import { Injectable, OnModuleInit } from "@nestjs/common";
import k8s from "@kubernetes/client-node";

@Injectable()
export class KubeApiService implements OnModuleInit {
    public k8sApi: k8s.CoreV1Api;
    public k8sConfig: k8s.KubeConfig;

    onModuleInit() {
        // const kc = new k8s.KubeConfig();
        // kc.loadFromDefault();
        //
        // this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        // this.k8sConfig = kc;
        //
        // console.log("KubeApiService initialized");
    }
}
