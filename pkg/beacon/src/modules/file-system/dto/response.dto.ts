import { FileTypeEnum } from "../../../types/enum/file.enum";

export class ListFileResponseDto {
    name: string;
    type: FileTypeEnum;
}

export class FolderTreeResponseDto {
    name: string;
    path: string;
    mimeType?: string;
    children?: FolderTreeResponseDto[];
}

export class FilePropertiesResponseDto {
    name: string;
    path: string;
    size: number;
    mimeType: string;
    created: Date;
    modified: Date;
}
