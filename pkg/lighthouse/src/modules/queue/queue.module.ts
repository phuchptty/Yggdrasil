import { Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const config = {
                    host: configService.get("redis.host"),
                    port: configService.get("redis.port"),
                };

                if (configService.get("redis.password")) {
                    config["password"] = configService.get("redis.password");
                }

                return {
                    redis: config,
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [QueueService],
})
export class QueueModule {}
