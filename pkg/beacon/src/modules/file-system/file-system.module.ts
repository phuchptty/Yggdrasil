import { Global, Module } from "@nestjs/common";
import { FileSystemService } from "./file-system.service";

@Global()
@Module({
    providers: [FileSystemService],
    exports: [FileSystemService],
})
export class FileSystemModule {}
