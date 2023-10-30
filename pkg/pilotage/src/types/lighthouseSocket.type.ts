export interface RequestVmForWorkspace {
    workspaceId: string;
    ownerId: string;
    podName: string;
}

export interface RequestExecUrlResponse {
    workspaceId: string;
    podName: string;
    execHost: string;
}
