import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { VmManagerService } from "./vm-manager.service";
import { VmManagerEvent } from "./vm-manager.constant";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class VmManagerGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
    constructor(private readonly vmManagerService: VmManagerService) {}

    async handleConnection(client: Socket) {
        await this.vmManagerService.handleSocketConnection(client);
    }

    async handleDisconnect(client: Socket) {
        await this.vmManagerService.handleDisconnect(client);
    }

    @SubscribeMessage("test")
    handleMessage(client: Socket): string {
        console.log(client.data);
        return "Hello world!";
    }

    @SubscribeMessage(VmManagerEvent.REQUEST_VM_FOR_WORKSPACE)
    handleRequestVmForWorkspace(client: Socket, payload: { workspaceSlug: string }) {
        return this.vmManagerService.requestVmForWorkspace(client.id, client.data.user, payload.workspaceSlug);
    }

    @SubscribeMessage(VmManagerEvent.HEARTBEAT)
    handleHeartbeat(client: Socket, payload: { podName: string; userId: string; workspaceSlug: string }) {
        if (client.data.user !== payload.userId) {
            throw new WsException("Unauthorized");
        }

        return this.vmManagerService.handleHeartbeat(client, payload.workspaceSlug, payload.podName);
    }

    @SubscribeMessage(VmManagerEvent.REQUEST_EXEC_URL)
    handleRequestExecUrl(client: Socket, payload: { workspaceId: string; podName: string }) {
        return {
            workspaceId: payload.workspaceId,
            podName: payload.podName,
            execHost: this.vmManagerService.generateExecUrl(payload.workspaceId, payload.podName),
        };
    }
}
