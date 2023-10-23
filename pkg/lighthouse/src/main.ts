import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    const app = await NestFactory.create(AppModule);

    app.enableCors()

    await app.listen(3000, "0.0.0.0");

    Logger.log(`🚀  Server running on ${await app.getUrl()}`, "Bootstrap");
    Logger.log(`🚀  Queue Board running on ${await app.getUrl()}/queues`, "Bootstrap");
    Logger.log(`🚀  Graphql running on ${await app.getUrl()}/graphql`, "Bootstrap");
}

bootstrap();
