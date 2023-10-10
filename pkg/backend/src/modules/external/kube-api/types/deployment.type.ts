import { V1ContainerPort, V1EnvVar, V1Lifecycle, V1Volume, V1VolumeMount } from "@kubernetes/client-node";

type KubeResource = {
    cpu?: string;
    memory?: string;
};

export type KubeCreateDeployment = {
    namespace: string;
    name: string;
    image: string;
    labels?: { [p: string]: string };
    ports?: V1ContainerPort[];
    volumeMounts?: V1VolumeMount[];
    volumes?: V1Volume[];
    env?: V1EnvVar[];
    lifecycle?: V1Lifecycle;
    resourceLimits?: KubeResource;
    resourceRequests?: KubeResource;
};
