import { shortenUUID } from "./uuid";

export const generateK8sNamespace = (workspaceId: string) => {
    return `workspace-${workspaceId}`;
};

export const generateK8sPodName = (workspaceId: string, ownerId: string) => {
    const minifiedOwnerId = shortenUUID(ownerId);
    return `vm-${workspaceId}-${minifiedOwnerId}`;
};

export const generateK8sVolumeName = (workspaceId: string, ownerId: string) => {
    const minifiedOwnerId = shortenUUID(ownerId);
    return `volume-${workspaceId}-${minifiedOwnerId}`;
}

export const generateK8sPvcName = (workspaceId: string) => {
    return `pvc-sandbox-${workspaceId}`;
}


