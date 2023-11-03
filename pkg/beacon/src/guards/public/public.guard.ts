import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import { WorkspacePermission } from "../../common/enums";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class PublicGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const client: Socket = context.switchToWs().getClient();

        // When public -> Only allow to write when workspace is owned by user
        if (client.data.workspace.permission === WorkspacePermission.PUBLIC) {
            const user = client.data.user;

            if (!user) {
                throw new WsException("Missing user data");
            }

            if (client.data.workspace.owner._id !== user.sub) {
                throw new WsException("Forbidden");
            }
        }

        return true;
    }
}
