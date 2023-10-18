import { Module } from "@nestjs/common";
import { GraphqlService } from "./graphql.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { KcClientModule } from "../external/kc-client/kc-client.module";
import { Context } from "graphql-ws";
import { GraphqlResolver } from './graphql.resolver';

@Module({
    providers: [GraphqlService, GraphqlResolver],
    imports: [
        KcClientModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [GraphqlModule],
            inject: [GraphqlService],
            useFactory: async (graphqlService: GraphqlService) => ({
                plugins: [ApolloServerPluginLandingPageLocalDefault()],
                playground: false,
                sortSchema: true,
                introspection: true,
                autoSchemaFile: true, // Enable generate schemas on-the-fly
                // resolvers: { JSON: GraphQLJSON },
                context: async ({ req, extra }) => graphqlService.handleContext(req || extra.request),
                subscriptions: {
                    "graphql-ws": {
                        onConnect: async (context: Context<any>) => graphqlService.handleSubscriptionOnConnect(context),
                        onDisconnect: async (context: Context<any>) => graphqlService.handleSubscriptionOnDisconnect(context),
                    },
                },
            }),
        }),
    ],
    exports: [GraphqlService],
})
export class GraphqlModule {}
