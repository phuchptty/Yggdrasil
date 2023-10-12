import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FileSystemModule } from "./modules/file-system/file-system.module";
import { GatewayModule } from "./modules/gateway/gateway.module";
import { KubeApiModule } from "./modules/external/kube-api/kube-api.module";
import { ContainerResourceModule } from "./modules/container-resource/container-resource.module";
import { appConfig, databaseConfig, keycloakConfig, redisConfig } from "./configs";
import { KcClientModule } from "./modules/external/kc-client/kc-client.module";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { WorkspaceModule } from "./modules/external/workspace/workspace.module";
import { MongooseModule } from "@nestjs/mongoose";
import { HealthModule } from "./modules/health/health.module";
import { AuthMiddleware } from "./middlewares/auth/auth.middleware";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig, keycloakConfig, redisConfig, databaseConfig],
            isGlobal: true,
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
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>("database.uri"),
                dbName: config.get<string>("database.name"),
            }),
        }),
        KcClientModule,
        FileSystemModule,
        GatewayModule,
        KubeApiModule,
        ContainerResourceModule,
        WorkspaceModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes("*");
    }
}
