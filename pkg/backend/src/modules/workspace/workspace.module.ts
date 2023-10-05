import { Module } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceResolver } from "./workspace.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Workspace, WorkspaceSchema } from "./schema/workspace.schema";
import { LanguageModule } from "../language/language.module";
import { BullModule } from "@nestjs/bull";
import { WORKSPACE_QUEUE_NAME } from "./workspace.const";
import { KubeApiModule } from "../external/kube-api/kube-api.module";

@Module({
    providers: [WorkspaceService, WorkspaceResolver],
    imports: [
        MongooseModule.forFeature([
            {
                name: Workspace.name,
                schema: WorkspaceSchema,
            },
        ]),
        BullModule.registerQueue({
            name: WORKSPACE_QUEUE_NAME,
        }),
        LanguageModule,
        KubeApiModule,
    ],
})
export class WorkspaceModule {}
