import { Injectable } from "@nestjs/common";
import { FileSystemService } from "../file-system/file-system.service";
import { GatewayResponseBlock } from "./dto/response.dto";
import { FilePropertiesResponseDto, FolderTreeResponseDto, ListFileResponseDto } from "../file-system/dto/response.dto";

@Injectable()
export class GatewayService {
    constructor(private readonly fsService: FileSystemService) {}

    listDir(path: string): GatewayResponseBlock<ListFileResponseDto[]> {
        const files = this.fsService.listFilesInFolder(path);

        return {
            success: true,
            data: files,
        };
    }

    dirTree(path: string): GatewayResponseBlock<FolderTreeResponseDto> {
        const tree = this.fsService.getFolderTree(path);

        return {
            success: true,
            data: tree,
        };
    }

    fileProperties(path: string): GatewayResponseBlock<FilePropertiesResponseDto> {
        try {
            const properties = this.fsService.getFileProperties(path);

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
            const content = this.fsService.readFileContent(path);

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
