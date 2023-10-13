import { FileType } from "../commons/enums";

export type FileSystemGetFileResponse = {
    size: number;
    actualSize: number;
    content: string;
    metaData: Record<string, any>;
    fileType: FileType;
};
