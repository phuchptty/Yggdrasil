import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { FileSystemModule } from "./modules/file-system/file-system.module";
import { GatewayModule } from "./modules/gateway/gateway.module";
import appConfig from "./configs/app.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig],
            isGlobal: true,
        }),
        // GraphQLModule.forRoot<ApolloDriverConfig>({
        //     driver: ApolloDriver,
        //     playground: false,
        //     plugins: [ApolloServerPluginLandingPageLocalDefault()],
        //     sortSchema: true,
        //     introspection: true,
        //     autoSchemaFile: true,
        //     subscriptions: {
        //         "graphql-ws": true,
        //     },
        // }),
        FileSystemModule,
        GatewayModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
