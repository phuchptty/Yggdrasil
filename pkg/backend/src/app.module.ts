import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { LanguageModule } from "./modules/language/language.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { QueueModule } from './modules/queue/queue.module';
import { KubeApiModule } from './modules/external/kube-api/kube-api.module';
import appConfig from "./configs/app.config";
import databaseConfig from "./configs/database.config";
import GraphQLJSON from "graphql-type-json";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig, databaseConfig],
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
        QueueModule,
        LanguageModule,
        WorkspaceModule,
        KubeApiModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
