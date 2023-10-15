import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { KubeConfig, CoreV1Api } from "@kubernetes/client-node";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";

@Injectable()
export class KubeApiService implements OnModuleInit {
    public k8sApi: CoreV1Api;
    public k8sConfig: KubeConfig;
    private logger = new Logger(KubeApiService.name);

    constructor(@InjectRedis() private readonly redis: Redis) {}

    onModuleInit() {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        this.k8sApi = kc.makeApiClient(CoreV1Api);
        this.k8sConfig = kc;

        this.logger.log("KubeApiService initialized");
    }

    async getPVNameFromPVC(namespace: string, pvc: string) {
        try {
            // TODO: Cache this if too slow
            // const cachePvName = await this.redis.get(`pv:${namespace}:${pvc}`);
            //
            // if (cachePvName) {
            //     return cachePvName;
            // }

            const pvcResponse = await this.k8sApi.readNamespacedPersistentVolumeClaim(pvc, namespace);

            // Cache for 1 hour
            // await this.redis.set(`pv:${namespace}:${pvc}`, currentPvName, "EX", 60 * 60);

            return pvcResponse.body.spec.volumeName;
        } catch (e) {
            if (e?.response?.body.status === "Failure") {
                throw new Error(e?.response.body.message);
            }

            throw new Error(e);
        }
    }
}
