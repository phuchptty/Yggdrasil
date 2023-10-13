import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { GraphQLError } from "graphql/error";
import { WorkspacePermission } from "../../commons/enums";
import { WorkspaceService } from "../workspace/workspace.service";

@Injectable()
export class VmManagerService {
    constructor(private configService: ConfigService, private readonly wsService: WorkspaceService, @InjectRedis() private readonly redis: Redis) {}

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
            }

            // If not push to queue
        } catch (e) {
            throw new GraphQLError(e);
        }
    }
}
