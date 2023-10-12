import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Workspace, WorkspaceDocument } from "./schema/workspace.schema";
import { Model } from "mongoose";
import { WorkspacePermission } from "../../../common/enums";

@Injectable()
export class WorkspaceService {
    constructor(@InjectModel(Workspace.name) private wsModel: Model<WorkspaceDocument>) {}

    async getWorkspaceById(id: string) {
        return this.wsModel.findById(id);
    }

    async validateWorkspaceWithUser(id: string, userId: string) {
        const workspace = await this.wsModel.findById(id);

        if (!workspace) {
            return false;
        }

        if (workspace.permission === WorkspacePermission.PUBLIC) {
            return true;
        }

        return workspace.owner._id.toString() === userId;
    }
}
