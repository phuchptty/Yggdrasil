import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { LanguageModule } from "./modules/language/language.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { QueueModule } from "./modules/queue/queue.module";
import { KubeApiModule } from "./modules/external/kube-api/kube-api.module";
import { UserModule } from "./modules/user/user.module";
import { KcClientModule } from "./modules/external/kc-client/kc-client.module";
import { keycloakConfig, appConfig, databaseConfig } from "./configs";
import GraphQLJSON from "graphql-type-json";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig, databaseConfig, keycloakConfig],
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
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            playground: false,
            sortSchema: true,
            introspection: true,
            autoSchemaFile: true, // Enable generate schemas on-the-fly
            resolvers: { JSON: GraphQLJSON },
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
        QueueModule,
        LanguageModule,
        WorkspaceModule,
        KubeApiModule,
        UserModule,
        KcClientModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
