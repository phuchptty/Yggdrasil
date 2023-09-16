import { IsString } from "class-validator";

export class ListDirDto {
    @IsString()
    path: string;
}
