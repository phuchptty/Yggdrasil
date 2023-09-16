import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000, "0.0.0.0");

    Logger.log(`🚀  Server running on ${await app.getUrl()}`, "Bootstrap");
    Logger.log(`🚀  Graphql running on ${await app.getUrl()}/graphql`, "Bootstrap");
}

bootstrap();
