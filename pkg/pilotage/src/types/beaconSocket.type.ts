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

export interface FileContentResponse extends BeaconResponseBlock<string> {
    data: string;
}
