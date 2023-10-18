import { Injectable, Logger } from "@nestjs/common";
import { KcClientService } from "../external/kc-client/kc-client.service";
import { Request } from "express";
import { Context } from "graphql-ws";
import { v4 as uuidv4 } from "uuid";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { extractSubFromToken } from "../../utils";

@Injectable()
export class GraphqlService {
    constructor(private readonly kcService: KcClientService, @InjectRedis() private readonly redis: Redis) {}

    private logger = new Logger(GraphqlService.name);

    private async introspectToken(token: string) {
        const strippedToken = token.replace("Bearer ", "");
        return this.kcService.introspectToken(strippedToken);
    }

    async handleContext(req: Request) {
        const token = req.headers.authorization || null;
        const socketId = req["socketId"] || null;

        if (!token) {
            return { ...req };
        }

        try {
            const introspectToken = await this.introspectToken(token);

            if (!introspectToken) {
                return { ...req };
            }

            // If socket connection -> Bind userId to socketId
            if (socketId) {
                const test = await this.redis.get(`socket:${introspectToken.sub}`);

                // TODO: Handle force disconnect subscription
                if (test) {
                    return false;
                }

                await this.redis.set(`socket:${introspectToken.sub}`, socketId, "EX", 60 * 60 * 24); // Expire in 1 day
            }

            return {
                ...req,
                kcSub: introspectToken.sub,
                kcRoles: this.getAppRoles(introspectToken.realm_access?.roles || []),
                socketId,
            };
        } catch (e) {
            this.logger.error(e);

            return { ...req };
        }
    }

    private getAppRoles(roles: string[]): string[] {
        const prefix = "app_";
        return roles.filter((role) => role.startsWith(prefix)).map((role) => role.replace(prefix, "").toUpperCase());
    }

    async handleSubscriptionOnConnect(context: Context<any, any>) {
        context.extra.request["socketId"] = uuidv4();
        context.extra.request.headers["authorization"] = context.connectionParams?.authorization || context.connectionParams?.Authorization || null;
    }

    async handleSubscriptionOnDisconnect(context: Context<any, any>) {
        const token = context.connectionParams?.authorization || context.connectionParams?.Authorization || null;

        if (!token) {
            return;
        }

        const realToken = token.replace("Bearer ", "");
        const userId = extractSubFromToken(realToken);
        const socketId = context.extra.request["socketId"];

        try {
            const redisData = await this.redis.get(`socket:${userId}`);

            if (redisData === socketId) {
                // await this.redis.del(`socket:${userId}`);
            }
        } catch (e) {
            throw new Error(e);
        }
    }
}
