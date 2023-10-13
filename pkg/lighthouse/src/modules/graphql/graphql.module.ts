import { Module } from "@nestjs/common";
import { GraphqlService } from "./graphql.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { KcClientModule } from "../external/kc-client/kc-client.module";

@Module({
    providers: [GraphqlService],
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
                context: async ({ req }) => graphqlService.handleContext(req),
            }),
        }),
    ],
    exports: [GraphqlService],
})
export class GraphqlModule {}
