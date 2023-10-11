import { Injectable } from "@nestjs/common";
import fs from "fs-extra";
import { basename, join } from "path";
import { ConfigService } from "@nestjs/config";
import { FilePropertiesResponseDto, FolderTreeResponseDto, ListFileResponseDto } from "./dto/response.dto";
import { FileTypeEnum } from "../../types/enum/file.enum";
import { toUnixPath } from "../../utils";
import mime from "mime-types";

@Injectable()
export class FileSystemService {
    constructor(private readonly configService: ConfigService) {}

    private getFsPath(filePath: string): string {
        return join(this.configService.get<string>("FS_PATH"), filePath);
    }

    listFilesInFolder(folderPath: string): ListFileResponseDto[] {
        const fsPath = this.getFsPath(folderPath);
        const files = fs.readdirSync(fsPath, { withFileTypes: true });

        return files.map((file) => ({
            name: file.name,
            type: file.isDirectory() ? FileTypeEnum.DIRECTORY : FileTypeEnum.FILE,
        }));
    }

    getFolderTree(folderPath: string): FolderTreeResponseDto {
        const fsPath = this.getFsPath(folderPath);
        const stats = fs.statSync(fsPath);
        if (!stats.isDirectory()) {
            return null;
        }

        const tree = {
            name: basename(fsPath),
            path: toUnixPath(folderPath),
            children: [],
        };

        const files = fs.readdirSync(fsPath);
        for (const file of files) {
            const filePath = join(fsPath, file);
            const fileStats = fs.statSync(filePath);

            if (fileStats.isDirectory()) {
                const childTree = this.getFolderTree(join(folderPath, file));

                if (childTree) {
                    tree.children.push(childTree);
                }
            } else {
                const mimeType = mime.lookup(filePath);

                tree.children.push({
                    name: file,
                    path: toUnixPath(join(folderPath, file)),
                    mimeType: mimeType,
                    size: fileStats.size,
                });
            }
        }

        return tree;
    }

    getFileProperties(filePath: string): FilePropertiesResponseDto {
        const fsPath = this.getFsPath(filePath);
        const stats = fs.statSync(fsPath);

        if (stats.isDirectory()) {
            throw new Error(`Path ${basename(fsPath)} is a directory`);
        }

        const mimeType = mime.lookup(filePath);

        return {
            name: basename(fsPath),
            path: filePath,
            size: stats.size,
            mimeType: mimeType ? mimeType : "application/octet-stream",
            created: stats.birthtime,
            modified: stats.mtime,
        };
    }

    readFileContent(filePath: string): string {
        const fsPath = this.getFsPath(filePath);
        return fs.readFileSync(fsPath, "utf8");
    }
}
