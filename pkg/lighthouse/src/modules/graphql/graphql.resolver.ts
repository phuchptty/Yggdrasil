import { Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

@Resolver()
export class GraphqlResolver {
    @Subscription(() => String)
    ping() {
        return pubSub.asyncIterator("Pong!");
    }
}
