import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GraphQLError } from "graphql/error";
import { WorkspacePermission } from "../../commons/enums";
import { WorkspaceService } from "../workspace/workspace.service";
import { KubeApiService } from "../external/kube-api/kube-api.service";
import { Workspace } from "../workspace/schema/workspace.schema";
import containerImagesConstant from "../../constants/containerImages.constant";
import { generateK8sNamespace, generateK8sPodName, generateK8sPvcName, generateK8sVolumeName } from "../../utils";
import urlJoin from "url-join";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { KcClientService } from "../external/kc-client/kc-client.service";
import { Socket } from "socket.io";
import { VmManagerEvent, VmState } from "./vm-manager.constant";
import { WsException } from "@nestjs/websockets";
import { RedisService } from "../redis/redis.service";
import { errorMessageConstant } from "../../constants";

@Injectable()
export class VmManagerService {
    constructor(
        private configService: ConfigService,
        private readonly wsService: WorkspaceService,
        private readonly kubeApi: KubeApiService,
        private readonly kcClient: KcClientService,
        private readonly redisService: RedisService,
    ) {}

    private logger = new Logger(VmManagerService.name);

    private getRedisKey(workspaceId: string, ownerId: string, podName: string) {
        return `vm:provision:${workspaceId}:${ownerId}:${podName}`;
    }

    private forceDisconnect(client: Socket, message?: string) {
        client.emit(VmManagerEvent.CONNECTION_MESSAGE, {
            type: "error",
            message: message || "Unauthorized",
        });

        client.disconnect(true);
    }

    async handleSocketConnection(client: Socket) {
        const authHeader = client.handshake.headers.authorization;

        try {
            if (!authHeader) {
                this.forceDisconnect(client, errorMessageConstant.MISSING_AUTHORIZATION_HEADER);
                return;
            }

            const token = authHeader.trim().replace("Bearer ", "");

            if (!token) {
                this.forceDisconnect(client, errorMessageConstant.MISSING_AUTHORIZATION_HEADER);
                return;
            }

            const user = await this.kcClient.introspectToken(token);

            if (!user) {
                this.forceDisconnect(client, errorMessageConstant.INVALID_TOKEN);
                return;
            }

            // Bind user to socket id
            client.data.user = user.sub; // ???
        } catch (e: any) {
            this.logger.error(e);
            this.forceDisconnect(client, "Unexpected error");
            return;
        }
    }

    async handleDisconnect(client: Socket) {
        const socketId = client.id;

        // Check if socketId is in redis
        const redisKey = await this.redisService.redisClient.ft.SEARCH("idx:vm-provision", `@socketId:${socketId}`);

        if (redisKey.total === 0 || redisKey.documents.length === 0) {
            return;
        }

        for (const document of redisKey.documents) {
            const key = document.id;
            const value = document.value;

            if (value.state === VmState.DISCONNECTED) {
                this.logger.warn(`Key ${key} disconnected but already marked as disconnected!`);
                continue;
            }

            // Set state to "disconnected"
            await this.redisService.redisClient.hSet(key, "state", VmState.DISCONNECTED);
            await this.redisService.redisClient.hSet(key, "disconnectedAt", dayjs().unix().toString());
            await this.redisService.redisClient.hSet(key, "socketId", "");
        }
    }

    async requestVmForWorkspace(socketId: string, owner: string, workspaceSlug: string) {
        try {
            // Query workspace
            const workspace = await this.wsService.findOneBySlug(owner, workspaceSlug);

            if (!workspace) {
                throw new WsException(errorMessageConstant.NO_WORKSPACE_FOUND_OR_USER_NO_PERMISSION);
            }

            if (workspace.permission === WorkspacePermission.PRIVATE && workspace.owner._id.toString() !== owner) {
                throw new WsException(errorMessageConstant.NO_WORKSPACE_FOUND_OR_USER_NO_PERMISSION);
            }

            const workspaceId = workspace._id.toString();
            const podName = `vm-${uuidv4()}`;
            const redisKey = this.getRedisKey(workspaceId, owner, podName);

            // Check exist vm exist
            const vmPersistCheck = await this.redisService.redisClient.hGet(redisKey, "socketId");

            if (vmPersistCheck) {
                // Check if socketId is the same -> same user
                if (socketId === vmPersistCheck) {
                    return {
                        workspaceId: workspaceId,
                        podName: podName,
                        ownerId: owner,
                    };
                } else {
                    throw new WsException(errorMessageConstant.ONLY_ONE_VM_PER_WORKSPACE);
                }
            } else {
                const rsp = await this.provisionVm(owner, podName, workspace);

                // Save to redis
                const redisPersistData = {
                    workspaceId: workspace._id.toString(),
                    ownerId: owner,
                    podName: podName,
                    socketId: socketId,
                    expiredAt: rsp.expiredAt,
                    state: VmState.PROVISIONED,
                };

                await this.redisService.redisClient.hSet(redisKey, redisPersistData);

                return rsp;
            }
        } catch (e) {
            throw new WsException(e);
        }
    }

    async provisionVm(ownerId: string, podName: string, workspaceData: Workspace) {
        try {
            const workspaceId = workspaceData._id.toString();
            const namespace = generateK8sNamespace(workspaceId);

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
                            imagePullPolicy: "Always",
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
                expiredAt: dayjs().add(4, "hour").unix(),
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

    generateAttachUrl(workspaceId: string, podName: string) {
        const namespace = generateK8sNamespace(workspaceId);
        return urlJoin(this.configService.get("publicK8sExecUrl"), `/api/v1/namespaces`, namespace, "pods", podName, "attach", `?container=${podName}`);
    }

    async handleHeartbeat(client: Socket, workspaceSlug: string, podName: string) {
        const ownerId = client.data.user;

        // When receive heartbeat, update expiredAt and socketid
        try {
            const workspace = await this.wsService.findOneBySlug(ownerId, workspaceSlug);

            if (!workspace) {
                throw new WsException(errorMessageConstant.NO_WORKSPACE_FOUND_OR_USER_NO_PERMISSION);
            }

            const workspaceId = workspace._id.toString();
            const redisKey = this.getRedisKey(workspaceId, ownerId, podName);

            const rsp = await this.redisService.redisClient.hGet(redisKey, "podName");

            if (!rsp) {
                throw new WsException(errorMessageConstant.VM_NOT_FOUND);
            }

            if (rsp !== podName) {
                throw new WsException("Unauthorized");
            }

            // Check if disconnected too long -> delete pod
            const disconnectedAt = await this.redisService.redisClient.hGet(redisKey, "disconnectedAt");

            if (disconnectedAt) {
                const disconnectedAtUnix = parseInt(disconnectedAt);
                const nowUnix = dayjs().unix();

                // 5 minutes
                if (nowUnix - disconnectedAtUnix > 300) {
                    await this.redisService.redisClient.hSet(redisKey, "state", VmState.PENDING_DELETE);
                    throw new WsException(errorMessageConstant.VM_DELETED_FOR_TIMEOUT);
                }
            }

            await this.redisService.redisClient.hSet(redisKey, {
                socketId: client.id,
                expiredAt: dayjs().add(4, "hour").unix(),
                state: VmState.PROVISIONED,
            });

            return {
                workspaceId: workspaceId,
                podName: podName,
                ownerId: ownerId,
            };
        } catch (e) {
            throw new WsException(e);
        }
    }

    async requestReCreateVm(ownerId: string, workspaceSlug: string) {
        try {
            // Query workspace
            const workspace = await this.wsService.findOneBySlug(ownerId, workspaceSlug);

            if (!workspace) {
                throw new GraphQLError("Không tìm thấy workspace hoặc bạn không có quyền truy cập workspace này!");
            }

            if (workspace.permission === WorkspacePermission.PRIVATE && workspace.owner._id.toString() !== ownerId) {
                throw new GraphQLError("Bạn không có quyền truy cập Workspace này!");
            }

            const namespace = generateK8sNamespace(workspace._id.toString());
            const podName = generateK8sPodName(workspace._id.toString(), ownerId);

            // Check exist vm
            // const vmTrashCheck = await this.redis.hgetall(`vm:provision:${podName}`);
            //
            // if (!vmTrashCheck) {
            //     throw new GraphQLError("Workspace này đã được xóa!");
            // }

            // Delete pod
            await this.kubeApi.deletePod(namespace, podName);

            // Recreate pod
            // return await this.provisionVm(ownerId, workspace);
        } catch (e) {
            if (e?.response?.body.status === "Failure") {
                throw new GraphQLError(e?.response.body.message);
            }

            throw new GraphQLError(e);
        }
    }
}
