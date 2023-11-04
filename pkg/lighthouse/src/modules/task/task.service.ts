import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { KubeApiService } from "../external/kube-api/kube-api.service";
import { VmState } from "../vm-manager/vm-manager.constant";
import { generateK8sNamespace } from "../../utils";
import dayjs from "dayjs";

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    constructor(private readonly redisService: RedisService, private readonly kubeClient: KubeApiService) {}

    public async getServices() {
        try {
            // Get all service related
            const appSelector = `app.kubernetes.io/name=beacon`;

            // return this.kubeClient.kubeApi.listServiceForAllNamespaces(undefined, undefined, undefined, appSelector);
            return this.kubeClient.kubeApi.listNamespacedService("beacon", undefined, undefined, undefined, undefined, appSelector);
        } catch (e) {
            throw new Error(e);
        }
    }

    private async deleteItem(namespace: string, podName: string, redisKey: string) {
        try {
            // Delete pod
            await this.kubeClient.deletePod(namespace, podName);

            // Delete pod from redis
            // Because services and ingress are not consume storage, so we don't need care too much about delete it
            await this.redisService.redisClient.del(redisKey);

            // Get all service related
            const appSelector = `podName=${podName}`;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const s = await this.kubeClient.kubeApi.listNamespacedService(namespace, undefined, undefined, undefined, undefined, appSelector);

            // Delete service
            for (const service of s.body.items) {
                await this.kubeClient.kubeApi.deleteNamespacedService(service.metadata.namespace, service.metadata.name);
            }

            // Find all ingress related
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const i = await this.kubeClient.kubeNetworkApi.listNamespacedIngress(namespace, undefined, undefined, undefined, undefined, appSelector);

            // Delete ingress
            for (const ingress of i.body.items) {
                await this.kubeClient.kubeNetworkApi.deleteNamespacedIngress(ingress.metadata.namespace, ingress.metadata.name);
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handlePendingDeletePod() {
        try {
            this.logger.debug("Performing task: handlePendingDeletePod");

            // Get all pending delete pods
            const redisKey = await this.redisService.redisClient.ft.SEARCH("idx:vm-provision", `@state:${VmState.PENDING_DELETE}`);

            if (redisKey.total === 0 || redisKey.documents.length === 0) {
                return;
            }

            for (const document of redisKey.documents) {
                const podName = document.value.podName as string;
                let workspaceId = document.value.workspaceId as string;

                if (!podName) {
                    continue;
                }

                if (!workspaceId) {
                    workspaceId = document.id.split(":")[2];
                }

                const namespace = generateK8sNamespace(workspaceId);

                try {
                    await this.kubeClient.kubeApi.readNamespacedPod("beacon", "beacon");
                    await this.deleteItem(namespace, podName, document.id);
                } catch (e) {
                    if (e.response.body.code === 404) {
                        await this.redisService.redisClient.del(document.id);
                        continue;
                    }

                    this.logger.error("Delete pod failed", e);
                }
            }
        } catch (e) {
            this.logger.error(e);
        }
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleDisconnectedPod() {
        try {
            this.logger.debug("Performing task: handleDisconnectedPod");

            // Get all pending delete pods
            const redisKey = await this.redisService.redisClient.ft.SEARCH("idx:vm-provision", `@state:${VmState.DISCONNECTED}`);

            if (redisKey.total === 0 || redisKey.documents.length === 0) {
                return;
            }

            for (const document of redisKey.documents) {
                const disconnectedAt = document.value.disconnectedAt as number;

                if (!disconnectedAt) {
                    continue;
                }

                const currentTime = dayjs().unix();

                if (currentTime - disconnectedAt > 5 * 60) {
                    // Set pod to pending delete
                    this.redisService.redisClient.hSet(document.id, "state", VmState.PENDING_DELETE);
                }
            }
        } catch (e) {
            this.logger.error(e);
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async handleExpiredWorkspace() {
        try {
            this.logger.debug("Performing task: handleExpiredWorkspace");

            // Get all pending delete pods
            const redisKey = await this.redisService.redisClient.ft.SEARCH("idx:vm-provision", `@state:${VmState.PROVISIONED}`);

            console.log(redisKey);

            if (redisKey.total === 0 || redisKey.documents.length === 0) {
                return;
            }

            for (const document of redisKey.documents) {
                const createdAt = document.value.createdAt as number;

                if (!createdAt) {
                    continue;
                }

                const currentTime = dayjs().unix();

                // 12 hours
                if (currentTime - createdAt > 12 * 60 * 60) {
                    // Set pod to pending delete
                    this.redisService.redisClient.hSet(document.id, "state", VmState.PENDING_DELETE);
                }
            }
        } catch (e) {
            this.logger.error(e);
        }
    }
}
