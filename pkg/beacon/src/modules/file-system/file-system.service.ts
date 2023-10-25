import { Injectable } from "@nestjs/common";
import fs from "fs-extra";
import { basename, join } from "path";
import { ConfigService } from "@nestjs/config";
import { FilePropertiesResponseDto, FolderFlatTreeResponseDto, FolderTreeResponseDto, ListFileResponseDto } from "./dto/response.dto";
import { FileTypeEnum } from "../../types/enum/file.enum";
import { toUnixPath } from "../../utils";
import mime from "mime-types";

@Injectable()
export class FileSystemService {
    constructor(private readonly configService: ConfigService) {}

    private baseDir = "";

    setBaseDir(baseDir: string) {
        if (this.configService.get("env") !== "development") {
            this.baseDir = baseDir;
        }
    }

    private getFsPath(filePath: string): string {
        return join(this.configService.get<string>("FS_PATH"), this.baseDir, filePath);
    }

    async listFilesInFolder(folderPath: string): Promise<ListFileResponseDto[]> {
        try {
            const fsPath = this.getFsPath(folderPath);
            const files = await fs.readdir(fsPath, { withFileTypes: true });

            return files.map((file) => {
                const mimeType = mime.lookup(file.path);
                const fileStats = fs.statSync(file.path);

                const rsp = {
                    name: file.name,
                    path: toUnixPath(join(folderPath, file.name)),
                    mimeType: mimeType ? mimeType : "text/plain",
                    size: fileStats.size || 0,
                    type: file.isDirectory() ? FileTypeEnum.DIRECTORY : FileTypeEnum.FILE,
                };

                if (file.isDirectory()) {
                    delete rsp.mimeType;
                    delete rsp.size;
                }

                return rsp;
            });
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
                        type: FileTypeEnum.FILE,
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

    async getFolderFlatTree(folderPath: string): Promise<FolderFlatTreeResponseDto[]> {
        try {
            const fsPath = this.getFsPath(folderPath);
            const stats = await fs.stat(fsPath);

            if (!stats.isDirectory()) {
                return null;
            }

            const result = [];

            function traverseFolder(currentFolder: string, currentPath = "") {
                const files = fs.readdirSync(currentFolder);

                files.forEach((file) => {
                    const filePath = join(currentFolder, file);
                    const stats = fs.statSync(filePath);
                    const mimeType = mime.lookup(filePath);

                    if (stats.isFile()) {
                        result.push({
                            name: file,
                            path: toUnixPath(join(currentPath, file)),
                            mimeType: mimeType,
                            size: stats.size,
                            type: FileTypeEnum.FILE,
                        });
                    } else if (stats.isDirectory()) {
                        traverseFolder(filePath, join(currentPath, file));
                    }
                });
            }

            traverseFolder(fsPath);

            return result;
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw new Error(e);
            }

            console.error(e);

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
