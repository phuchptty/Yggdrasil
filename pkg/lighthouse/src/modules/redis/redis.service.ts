import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { createClient, SchemaFieldTypes } from "redis";
import { ConfigService } from "@nestjs/config";
import { RedisClient } from "./redis.type";

@Injectable()
export class RedisService implements OnModuleInit {
    public redisClient: RedisClient;
    private logger = new Logger(RedisService.name);

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        try {
            let url = "";

            if (this.configService.get<string>("redis.pass")) {
                url = `redis://default:${this.configService.get<string>("redis.pass")}@`;
            } else {
                url = "redis://";
            }

            url += `${this.configService.get<string>("redis.host")}:${this.configService.get<number>("redis.port")}`;

            const redis = createClient({
                url,
            });

            redis.on("error", (err) => {
                this.logger.error("Redis error", err);
            });

            redis.on("connect", () => {
                this.logger.log("Node Redis connected");
            });

            await redis.connect();

            this.redisClient = redis;

            await this.createVmProvisionIndex();
        } catch (e) {
            this.logger.error(e);
        }
    }

    private async createVmProvisionIndex() {
        const indexName = "idx:vm-provision";
        const prefix = "vm:provision:";

        try {
            await this.redisClient.ft.create(
                indexName,
                {
                    socketId: {
                        type: SchemaFieldTypes.TEXT,
                    },
                    ownerId: {
                        type: SchemaFieldTypes.TEXT,
                    },
                    state: {
                        type: SchemaFieldTypes.TEXT,
                    },
                },
                {
                    ON: "HASH",
                    PREFIX: prefix,
                },
            );

            this.logger.log(`Index ${indexName} created successfully!`);
        } catch (e) {
            if (e.message === "Index already exists") {
                this.logger.log("Index exists already, skipped creation.");
            } else {
                // Something went wrong, perhaps RedisSearch isn't installed...
                this.logger.error(e);
                process.exit(1);
            }
        }
    }
}
