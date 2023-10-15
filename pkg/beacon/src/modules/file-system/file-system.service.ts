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

    private baseDir = "";

    setBaseDir(baseDir: string) {
        this.baseDir = baseDir;
    }

    private getFsPath(filePath: string): string {
        return join(this.configService.get<string>("FS_PATH"), this.baseDir, filePath);
    }

    async listFilesInFolder(folderPath: string): Promise<ListFileResponseDto[]> {
        try {
            const fsPath = this.getFsPath(folderPath);
            const files = await fs.readdir(fsPath, { withFileTypes: true });

            return files.map((file) => ({
                name: file.name,
                type: file.isDirectory() ? FileTypeEnum.DIRECTORY : FileTypeEnum.FILE,
            }));
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw new Error(e);
            }

            throw new Error(`Đường dẫn ${folderPath} không tồn tại`);
        }
    }

    async getFolderTree(folderPath: string): Promise<FolderTreeResponseDto> {
        try {
            const fsPath = this.getFsPath(folderPath);
            const stats = await fs.stat(fsPath);
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
                    const childTree = await this.getFolderTree(join(folderPath, file));

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
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw new Error(e);
            }

            throw new Error(`Đường dẫn ${folderPath} không tồn tại`);
        }
    }

    async getFileProperties(filePath: string): Promise<FilePropertiesResponseDto> {
        try {
            const fsPath = this.getFsPath(filePath);
            const stats = await fs.stat(fsPath);

            if (stats.isDirectory()) {
                throw new Error(`Đường dẫn ${basename(fsPath)} là thư mục`);
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
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw new Error(e);
            }

            throw new Error(`Tập tin ${filePath} không tồn tại`);
        }
    }

    async readFileContent(filePath: string): Promise<string> {
        try {
            const fsPath = this.getFsPath(filePath);
            return fs.readFile(fsPath, "utf8");
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw new Error(e);
            }

            throw new Error(`Tập tin ${filePath} không tồn tại`);
        }
    }
}
