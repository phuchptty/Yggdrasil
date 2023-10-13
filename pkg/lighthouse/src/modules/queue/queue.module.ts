import { Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullBoardModule } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const config = {
                    host: configService.get("redis.host"),
                    port: configService.get("redis.port"),
                };

                if (configService.get("redis.pass")) {
                    config["password"] = configService.get("redis.pass");
                }

                return {
                    redis: config,
                };
            },
            inject: [ConfigService],
        }),
        BullBoardModule.forRoot({
            route: "/queues",
            adapter: ExpressAdapter,
        }),
    ],
    providers: [QueueService],
})
export class QueueModule {}
