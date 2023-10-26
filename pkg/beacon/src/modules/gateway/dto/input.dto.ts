import { IsString } from "class-validator";

export class ListDirDto {
    @IsString()
    path: string;
}

export class RenameDto {
    @IsString()
    path: string;

    @IsString()
    newPath: string;
}

export class SaveFileContentDto {
    @IsString()
    path: string;

    @IsString()
    content: string;
}