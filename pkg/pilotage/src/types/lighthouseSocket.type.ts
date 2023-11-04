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

interface LightHouseRsp {
    workspaceId: string;
    podName: string;
}

export type PortForwardData = {
    port: number;
    domain: string;
};

export interface GetListPortForwardResponse extends LightHouseRsp {
    ports: PortForwardData[];
}
