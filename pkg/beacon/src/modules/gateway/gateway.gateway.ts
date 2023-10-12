import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import GatewayPackage from "./gatewayPackage";
import { GatewayService } from "./gateway.service";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { ListDirDto } from "./dto/input.dto";
import { Socket } from "socket.io";
import { KcClientService } from "../external/kc-client/kc-client.service";
import { WorkspaceService } from "../external/workspace/workspace.service";
import { WorkspacePermission } from "../../common/enums";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
@UsePipes(new ValidationPipe())
export class GatewayGateway implements OnGatewayConnection<Socket> {
    constructor(
        private readonly gatewayService: GatewayService,
        private readonly kcClient: KcClientService,
        private readonly wsService: WorkspaceService,
    ) {}

    private forceDisconnect(client: Socket, message?: string) {
        client.emit(GatewayPackage.CONNECTION_MESSAGE, {
            type: "error",
            message: message || "Unauthorized",
        });

        client.disconnect(true);
    }

    async handleConnection(client: Socket) {
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
                    this.forceDisconnect(client);
                    return;
                }

                const token = authHeader.trim().replace("Bearer ", "");

                if (!token) {
                    this.forceDisconnect(client);
                    return;
                }

                const user = await this.kcClient.introspectToken(token);

                if (!user) {
                    this.forceDisconnect(client);
                    return;
                }

                if (workspace.owner._id !== user.sub) {
                    this.forceDisconnect(client, "Forbidden");
                    return;
                }
            }

            this.gatewayService.setWorkspacePath(workspaceId);
        } catch (e: any) {
            this.forceDisconnect(client, "Unexpected error");
            return;
        }
    }

    @SubscribeMessage(GatewayPackage.LIST_DIR)
    packageListDir(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Path is required");
        }

        return this.gatewayService.listDir(params.path);
    }

    @SubscribeMessage(GatewayPackage.DIR_TREE)
    packageDirTree(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Path is required");
        }

        return this.gatewayService.dirTree(params.path);
    }

    @SubscribeMessage(GatewayPackage.FILE_PROPERTIES)
    packageFileProperties(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Path is required");
        }

        return this.gatewayService.fileProperties(params.path);
    }

    @SubscribeMessage(GatewayPackage.GET_FILE_CONTENT)
    packageGetFileContent(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Path is required");
        }

        return this.gatewayService.getFileContent(params.path);
    }
}
