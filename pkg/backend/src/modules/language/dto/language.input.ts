import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType("Playground_CreateLanguageInput")
export class CreateLanguageInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    key: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    editorKey: string;
}

@InputType("Playground_UpdateLanguageInput")
export class UpdateLanguageInput extends PartialType(CreateLanguageInput) { }