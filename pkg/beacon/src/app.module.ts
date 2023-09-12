import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import appConfig from "./configs/app.config";
import databaseConfig from "./configs/database.config";

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
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            sortSchema: true,
            introspection: true,
            autoSchemaFile: false,
            subscriptions: {
                "graphql-ws": true,
            },
        }),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
