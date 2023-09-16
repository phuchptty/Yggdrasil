import { MessageBody, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import GatewayPackage from "../../constants/gatewayPackage";
import { GatewayService } from "./gateway.service";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { ListDirDto } from "./dto/input.dto";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
@UsePipes(new ValidationPipe())
export class GatewayGateway {
    constructor(private readonly gatewayService: GatewayService) {}

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
