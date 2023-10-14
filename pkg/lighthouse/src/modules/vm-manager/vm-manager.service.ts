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
import { shortenUUID } from "../../utils";

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
                // Push to queue
                const vm = await this.provisionVm(owner, workspace);

                console.log(vm.response);
            }

            // If not push to queue
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async provisionVm(ownerId: string, workspaceData: Workspace) {
        try {
            const minifiedOwnerId = shortenUUID(ownerId);
            const workspaceId = workspaceData._id.toString();
            const namespace = `workspace-${workspaceData._id.toString()}`;

            const podName = `vm-${workspaceId}-${minifiedOwnerId}`;
            const volumeName = `volume-${workspaceId}-${minifiedOwnerId}`;
            const pvcName = `pvc-sandbox-${workspaceId}`;

            // Get language
            const language = workspaceData.workspaceLanguage;
            const containerImage = containerImagesConstant["baseImage"][language.key];

            const kubeRsp = await this.kubeApi.createPod(namespace, {
                metadata: {
                    name: podName,
                    labels: {
                        app: podName,
                    },
                },
                spec: {
                    containers: [
                        {
                            name: podName,
                            image: containerImage,
                            imagePullPolicy: this.configService.get("env") === "development" ? "Always" : "IfNotPresent",
                            volumeMounts: [
                                {
                                    name: volumeName,
                                    mountPath: "/home/alixia/runner",
                                    subPath: workspaceId,
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
                },
            });

            return kubeRsp;
        } catch (e) {
            if (e?.response?.body.status === "Failure") {
                throw new GraphQLError(e?.response.body.message);
            }

            throw new GraphQLError(e);
        }
    }
}
