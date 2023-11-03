import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import GatewayPackage from "./gatewayPackage";
import { GatewayService } from "./gateway.service";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ListDirDto, RenameDto, SaveFileContentDto } from "./dto/input.dto";
import { Socket } from "socket.io";
import { PublicGuard } from "../../guards/public/public.guard";

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

    @SubscribeMessage(GatewayPackage.DIR_FLAT_TREE)
    packageDirFlatTree(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.dirFlatTree(params.path);
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

    @SubscribeMessage(GatewayPackage.CREATE_FILE)
    @UseGuards(PublicGuard)
    packageCreateFile(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.createFile(params.path);
    }

    @SubscribeMessage(GatewayPackage.CREATE_FOLDER)
    @UseGuards(PublicGuard)
    packageCreateFolder(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.createFolder(params.path);
    }

    @SubscribeMessage(GatewayPackage.RENAME)
    @UseGuards(PublicGuard)
    packageRenameFile(@MessageBody("params") params: RenameDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }
        if (params.newPath === undefined || params.newPath === null) {
            throw new WsException("Thiếu tên mới");
        }

        return this.gatewayService.renamePath(params.path, params.newPath);
    }

    @SubscribeMessage(GatewayPackage.DELETE)
    @UseGuards(PublicGuard)
    packageDeletePath(@MessageBody("params") params: ListDirDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }

        return this.gatewayService.deletePath(params.path);
    }

    @SubscribeMessage(GatewayPackage.SAVE_FILE_CONTENT)
    @UseGuards(PublicGuard)
    packageSaveFileContent(@MessageBody("params") params: SaveFileContentDto) {
        if (params.path === undefined || params.path === null) {
            throw new WsException("Thiếu đường dẫn");
        }
        if (params.content === undefined || params.content === null) {
            throw new WsException("Thiếu nội dung");
        }

        return this.gatewayService.saveFileContent(params.path, params.content);
    }
}
