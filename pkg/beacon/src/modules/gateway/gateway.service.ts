import { Injectable, Logger } from "@nestjs/common";
import { FileSystemService } from "../file-system/file-system.service";
import { GatewayResponseBlock } from "./dto/response.dto";
import { FilePropertiesResponseDto, FolderTreeResponseDto, ListFileResponseDto } from "../file-system/dto/response.dto";
import { Socket } from "socket.io";
import GatewayPackage from "./gatewayPackage";
import { WorkspacePermission } from "../../common/enums";
import { KcClientService } from "../external/kc-client/kc-client.service";
import { WorkspaceService } from "../external/workspace/workspace.service";
import { KubeApiService } from "../external/kube-api/kube-api.service";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class GatewayService {
    constructor(
        private readonly fsService: FileSystemService,
        private readonly kcClient: KcClientService,
        private readonly wsService: WorkspaceService,
        private readonly kubeService: KubeApiService,
    ) {}

    private logger = new Logger(GatewayService.name);

    setWorkspacePath(workspaceId: string) {
        this.fsService.setBaseDir(workspaceId);
    }

    private forceDisconnect(client: Socket, message?: string) {
        client.emit(GatewayPackage.CONNECTION_MESSAGE, {
            type: "error",
            message: message || "Unauthorized",
        });

        client.disconnect(true);
    }

    async handleSocketConnection(client: Socket) {
        const authHeader = client.handshake.headers.authorization;
        const workspaceId = client.handshake.query?.workspace as string;

        if (!workspaceId) {
            this.forceDisconnect(client, "Workspace is required");
            return;
        }

        try {
            const workspace = await this.wsService.getWorkspaceById(workspaceId);

            if (!workspace) {
                this.forceDisconnect(client, "Workspace not found");
                return;
            }

            if (workspace.permission === WorkspacePermission.PRIVATE) {
                if (!authHeader) {
                    this.forceDisconnect(client, "Missing authorization token");
                    return;
                }

                const token = authHeader.trim().replace("Bearer ", "");

                if (!token) {
                    this.forceDisconnect(client, "Missing post authorization token");
                    return;
                }

                const user = await this.kcClient.introspectToken(token);

                if (!user) {
                    this.forceDisconnect(client, "Invalid token");
                    return;
                }

                if (workspace.owner._id !== user.sub) {
                    this.forceDisconnect(client, "Forbidden");
                    return;
                }
            }

            const workspacePVCName = `pvc-sandbox-${workspaceId.toString()}`;
            const namespace = `workspace-${workspaceId}`;

            const pvName = await this.kubeService.getPVNameFromPVC(namespace, workspacePVCName);

            this.setWorkspacePath(pvName);
        } catch (e: any) {
            this.logger.error(e);
            this.forceDisconnect(client, "Unexpected error");
            return;
        }
    }

    async listDir(path: string): Promise<GatewayResponseBlock<ListFileResponseDto[]>> {
        try {
            const files = await this.fsService.listFilesInFolder(path);

            return {
                success: true,
                data: files,
            };
        } catch (e) {
            throw new WsException(e.message);
        }
    }

    async dirTree(path: string): Promise<GatewayResponseBlock<FolderTreeResponseDto>> {
        try {
            const tree = await this.fsService.getFolderTree(path);

            return {
                success: true,
                data: tree,
            };
        } catch (e) {
            throw new WsException(e.message);
        }
    }

    async fileProperties(path: string): Promise<GatewayResponseBlock<FilePropertiesResponseDto>> {
        try {
            const properties = await this.fsService.getFileProperties(path);

            return {
                success: true,
                data: properties,
            };
        } catch (e) {
            throw new WsException(e.message);
        }
    }

    async getFileContent(path: string): Promise<GatewayResponseBlock<string>> {
        try {
            const content = await this.fsService.readFileContent(path);

            return {
                success: true,
                data: content,
            };
        } catch (e) {
            throw new WsException(e.message);
        }
    }
}
