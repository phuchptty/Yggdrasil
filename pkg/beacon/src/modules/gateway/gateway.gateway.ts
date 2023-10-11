import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import GatewayPackage from "../../constants/gatewayPackage";
import { GatewayService } from "./gateway.service";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { ListDirDto } from "./dto/input.dto";
import { Socket } from "socket.io";
import { KcClientService } from "../external/kc-client/kc-client.service";

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
    ) {}

    private forceDisconnect(client: Socket) {
        client.emit("CONNECTION_MESSAGE", {
            type: "error",
            message: "Unauthorized",
        });

        client.disconnect(true);
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const authHeader = client.handshake.headers.authorization;

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

        console.log(user);

        !user && this.forceDisconnect(client);
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
