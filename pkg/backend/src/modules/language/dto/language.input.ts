import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { PlaygroundType } from "../../../commons/enums";

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

    @Field(() => PlaygroundType)
    @IsNotEmpty()
    @IsString()
    playgroundType: PlaygroundType;
}

@InputType("Playground_UpdateLanguageInput")
export class UpdateLanguageInput extends PartialType(CreateLanguageInput) { }