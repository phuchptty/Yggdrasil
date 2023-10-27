export interface BeaconConnectionMessage {
    type: string;
    message?: string;
}

export interface BeaconResponseBlock<T> {
    success: boolean;
    data?: T;
}

interface DirTreeItem {
    name: string;
    path: string;
    children?: DirTreeItem[];
}

export interface DirTreeResponse extends BeaconResponseBlock<DirTreeItem> {
    data: DirTreeItem;
}

export enum FileType {
    FILE = 'FILE',
    DIRECTORY = 'DIRECTORY',
}

export interface ListFileItem {
    name: string;
    path: string;
    type: FileType;
    size?: number;
    mimeType?: string;
}

export interface ListFileResponse extends BeaconResponseBlock<ListFileItem[]> {
    data: ListFileItem[];
}

export interface DirFlatTree extends ListFileItem {}

export interface DirFlatTreeResponse extends BeaconResponseBlock<DirFlatTree[]> {
    data: DirFlatTree[];
}

export interface FilePropertiesResponseDto {
    name: string;
    path: string;
    size: number;
    mimeType: string;
    created: Date;
    modified: Date;
}

export interface FilePropertiesResponse extends BeaconResponseBlock<FilePropertiesResponseDto> {
    data: FilePropertiesResponseDto;
}

export interface FolderFlatTreeResponseDto {
    name: string;
    path: string;
    mimeType?: string;
    size?: number;
    type: FileType;
}

export interface GetFileContentResponseDto extends FilePropertiesResponseDto {
    content: string;
}

export interface FileContentResponse extends BeaconResponseBlock<GetFileContentResponseDto> {
    data: GetFileContentResponseDto;
}

export interface FileCreateResponse extends BeaconResponseBlock<string> {
    data: string;
}

export interface DeletePathResponse extends BeaconResponseBlock<boolean> {
    data: boolean;
}

export interface SaveFileContentResponse extends BeaconResponseBlock<string> {
    data: string;
}