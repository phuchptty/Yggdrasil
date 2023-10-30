import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { LanguageModule } from "./modules/language/language.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { QueueModule } from "./modules/queue/queue.module";
import { KubeApiModule } from "./modules/external/kube-api/kube-api.module";
import { UserModule } from "./modules/user/user.module";
import { KcClientModule } from "./modules/external/kc-client/kc-client.module";
import { keycloakConfig, appConfig, databaseConfig, workspaceConfig } from "./configs";
import { GraphqlModule } from "./modules/graphql/graphql.module";
import { VmManagerModule } from "./modules/vm-manager/vm-manager.module";
import { RedisModule as NodeRedisModule } from "./modules/redis/redis.module";
import { TaskModule } from './modules/task/task.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig, databaseConfig, keycloakConfig, workspaceConfig],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>("database.uri"),
                dbName: config.get<string>("database.name"),
            }),
        }),
        NodeRedisModule,
        GraphqlModule,
        QueueModule,
        LanguageModule,
        WorkspaceModule,
        KubeApiModule,
        UserModule,
        KcClientModule,
        VmManagerModule,
        TaskModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
