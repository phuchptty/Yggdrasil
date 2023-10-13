import { Module } from "@nestjs/common";
import { LanguageService } from "./language.service";
import { LanguageResolver } from "./language.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Language, LanguageSchema } from "./schema/language.schema";

@Module({
    providers: [LanguageService, LanguageResolver],
    imports: [
        MongooseModule.forFeature([
            {
                name: Language.name,
                schema: LanguageSchema,
            },
        ]),
    ],
    exports: [LanguageService],
})
export class LanguageModule {}
