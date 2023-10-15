import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { GraphQLError } from "graphql/error";
import { WorkspacePermission } from "../../commons/enums";
import { WorkspaceService } from "../workspace/workspace.service";
import { KubeApiService } from "../external/kube-api/kube-api.service";
import { Workspace } from "../workspace/schema/workspace.schema";
import containerImagesConstant from "../../constants/containerImages.constant";
import { generateK8sNamespace, generateK8sPodName, generateK8sPvcName, generateK8sVolumeName } from "../../utils";
import urlJoin from "url-join";

@Injectable()
export class VmManagerService {
    constructor(private configService: ConfigService, private readonly wsService: WorkspaceService, @InjectRedis() private readonly redis: Redis, private readonly kubeApi: KubeApiService) {}

    private logger = new Logger(VmManagerService.name);

    async requestVmForWorkspace(owner: string, workspaceSlug: string) {
        try {
            // Query workspace
            const workspace = await this.wsService.findOneBySlug(owner, workspaceSlug);

            if (!workspace) {
                throw new GraphQLError("Không tìm thấy workspace hoặc bạn không có quyền truy cập workspace này!");
            }

            if (workspace.permission === WorkspacePermission.PRIVATE && workspace.owner._id.toString() !== owner) {
                throw new GraphQLError("Bạn không có quyền truy cập Workspace này!");
            }

            // Check exist vm in trash
            const vmTrashCheck = await this.redis.get(`vm:trash:${workspace._id}`);

            if (vmTrashCheck) {
            } else {
                return await this.provisionVm(owner, workspace);
            }
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async provisionVm(ownerId: string, workspaceData: Workspace) {
        try {
            const workspaceId = workspaceData._id.toString();
            const namespace = generateK8sNamespace(workspaceId);

            const podName = generateK8sPodName(workspaceId, ownerId);
            const volumeName = generateK8sVolumeName(workspaceId, ownerId);
            const pvcName = generateK8sPvcName(workspaceId);

            // Get language
            const language = workspaceData.workspaceLanguage;
            const containerImage = containerImagesConstant["baseImage"][language.key];

            await this.kubeApi.createPod(namespace, {
                metadata: {
                    name: podName,
                    labels: {
                        app: podName,
                    },
                },
                spec: {
                    automountServiceAccountToken: false,
                    containers: [
                        {
                            name: podName,
                            image: containerImage,
                            imagePullPolicy: this.configService.get("env") === "development" ? "Always" : "IfNotPresent",
                            volumeMounts: [
                                {
                                    name: volumeName,
                                    mountPath: "/home/alixia/runner",
                                },
                            ],
                        },
                    ],
                    volumes: [
                        {
                            name: volumeName,
                            persistentVolumeClaim: {
                                claimName: pvcName,
                            },
                        },
                    ],
                    securityContext: {
                        fsGroup: 1234,
                    },
                },
            });

            return {
                workspaceId: workspaceId,
                podName: podName,
                ownerId: ownerId,
            };
        } catch (e) {
            if (e?.response?.body.status === "Failure") {
                throw new GraphQLError(e?.response.body.message);
            }

            throw new GraphQLError(e);
        }
    }

    generateBeaconUrl(workspaceId: string) {
        return `${this.configService.get("publicBeaconUrl")}/?workspace=${workspaceId}`;
    }

    generateExecUrl(workspaceId: string, podName: string) {
        const namespace = generateK8sNamespace(workspaceId);
        return urlJoin(this.configService.get("publicK8sExecUrl"), `/api/v1/namespaces`, namespace, "pods", podName, "exec", `?container=${podName}`);
    }
}
