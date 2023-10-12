import { Injectable } from "@nestjs/common";
import { FileSystemService } from "../file-system/file-system.service";
import { GatewayResponseBlock } from "./dto/response.dto";
import { FilePropertiesResponseDto, FolderTreeResponseDto, ListFileResponseDto } from "../file-system/dto/response.dto";
import { join } from "path";

@Injectable()
export class GatewayService {
    constructor(private readonly fsService: FileSystemService) {}

    private workspacePath = "";

    setWorkspacePath(workspaceId: string) {
        this.workspacePath = workspaceId;
    }

    private constructPath = (path: string) => join(`${this.workspacePath}/${path}`);

    listDir(path: string): GatewayResponseBlock<ListFileResponseDto[]> {
        const files = this.fsService.listFilesInFolder(this.constructPath(path));

        return {
            success: true,
            data: files,
        };
    }

    dirTree(path: string): GatewayResponseBlock<FolderTreeResponseDto> {
        const tree = this.fsService.getFolderTree(this.constructPath(path));

        return {
            success: true,
            data: tree,
        };
    }

    fileProperties(path: string): GatewayResponseBlock<FilePropertiesResponseDto> {
        try {
            const properties = this.fsService.getFileProperties(this.constructPath(path));

            return {
                success: true,
                data: properties,
            };
        } catch (e) {
            return {
                success: false,
                message: e.message,
            };
        }
    }

    getFileContent(path: string): GatewayResponseBlock<string> {
        try {
            const content = this.fsService.readFileContent(this.constructPath(path));

            return {
                success: true,
                data: content,
            };
        } catch (e) {
            return {
                success: false,
                message: e.message,
            };
        }
    }
}
