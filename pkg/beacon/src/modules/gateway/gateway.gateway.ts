import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import GatewayPackage from "./gatewayPackage";
import { GatewayService } from "./gateway.service";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { ListDirDto } from "./dto/input.dto";
import { Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
@UsePipes(new ValidationPipe())
export class GatewayGateway implements OnGatewayConnection<Socket> {
    constructor(private readonly gatewayService: GatewayService) {}

    async handleConnection(client: Socket) {
        await this.gatewayService.handleSocketConnection(client);
    }

    @SubscribeMessage(GatewayPackage.LIST_DIR)
    packageListDir(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.listDir(params.path);
    }

    @SubscribeMessage(GatewayPackage.DIR_TREE)
    packageDirTree(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.dirTree(params.path);
    }

    @SubscribeMessage(GatewayPackage.FILE_PROPERTIES)
    packageFileProperties(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.fileProperties(params.path);
    }

    @SubscribeMessage(GatewayPackage.GET_FILE_CONTENT)
    packageGetFileContent(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.getFileContent(params.path);
    }
}
