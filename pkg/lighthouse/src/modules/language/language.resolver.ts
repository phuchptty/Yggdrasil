import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LanguageService } from "./language.service";
import { Language } from "./schema/language.schema";
import { CreateLanguageInput, UpdateLanguageInput } from "./dto/language.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { RoleEnum } from "../../commons/enums";
import { Role } from "../../decorators/role/role.decorator";

@Resolver()
export class LanguageResolver {
    constructor(private readonly languageService: LanguageService) {}

    @Query(() => [Language], { name: "playground_languages" })
    async languages(): Promise<Language[]> {
        return this.languageService.findAll();
    }

    @Query(() => Language, { name: "playground_language" })
    async language(@Args("id", { type: () => ID }) id: string): Promise<Language> {
        return this.languageService.findOneById(id);
    }

    @Mutation(() => Language, { name: "playground_createLanguage" })
    @UseGuards(AuthGuard)
    @Role(RoleEnum.ADMIN)
    async createLanguage(@Args("input") input: CreateLanguageInput): Promise<Language> {
        return this.languageService.create(input);
    }

    @Mutation(() => Language, { name: "playground_updateLanguage" })
    @UseGuards(AuthGuard)
    @Role(RoleEnum.ADMIN)
    async updateLanguage(@Args("id", { type: () => ID }) id: string, @Args("input") input: UpdateLanguageInput): Promise<Language> {
        return this.languageService.update(id, input);
    }

    @Mutation(() => Boolean, { name: "playground_deleteLanguage" })
    @UseGuards(AuthGuard)
    @Role(RoleEnum.ADMIN)
    async deleteLanguage(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
        await this.languageService.delete(id);
        return true;
    }
}
