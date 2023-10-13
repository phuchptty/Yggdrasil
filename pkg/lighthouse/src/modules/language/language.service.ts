import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import { Language, LanguageDocument } from "./schema/language.schema";
import { CreateLanguageInput, UpdateLanguageInput } from "./dto/language.input";

@Injectable()
export class LanguageService {
    constructor(@InjectModel(Language.name) private languageModel: PaginateModel<LanguageDocument>) { }

    async findAll(): Promise<LanguageDocument[]> {
        return this.languageModel.find().exec();
    }

    async findOneById(id: string): Promise<LanguageDocument> {
        return this.languageModel.findById(id).exec();
    }

    async create(language: CreateLanguageInput) {
        return this.languageModel.create(language);
    }

    async update(id: string, language: UpdateLanguageInput) {
        return this.languageModel.findByIdAndUpdate(id, language, { new: true }).exec();
    }

    async delete(id: string) {
        return this.languageModel.findByIdAndDelete(id).exec();
    }
}
