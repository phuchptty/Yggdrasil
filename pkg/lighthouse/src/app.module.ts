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
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { GraphqlModule } from "./modules/graphql/graphql.module";
import { VmManagerModule } from './modules/vm-manager/vm-manager.module';

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
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const infoObj = {
                    host: configService.get<string>("redis.host"),
                    port: configService.get<number>("redis.port"),
                };

                if (configService.get<string>("redis.pass")) {
                    infoObj["password"] = configService.get<string>("redis.pass");
                }

                return {
                    config: infoObj,
                };
            },
        }),
        GraphqlModule,
        QueueModule,
        LanguageModule,
        WorkspaceModule,
        KubeApiModule,
        UserModule,
        KcClientModule,
        VmManagerModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
