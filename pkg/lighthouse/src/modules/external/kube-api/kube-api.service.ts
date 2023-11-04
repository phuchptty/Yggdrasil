import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AppsV1Api, CoreV1Api, KubeConfig, NetworkingV1Api, V1Pod } from "@kubernetes/client-node";
import { ConfigService } from "@nestjs/config";
import { KubeCreateDeployment } from "./types/deployment.type";

@Injectable()
export class KubeApiService implements OnModuleInit {
    private logger = new Logger(KubeApiService.name);
    public kubeConfig: KubeConfig;

    public kubeApi: CoreV1Api;
    public kubeAppsApi: AppsV1Api;
    public kubeNetworkApi: NetworkingV1Api;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit(): any {
        const kc = new KubeConfig();
        kc.loadFromDefault();

        this.kubeApi = kc.makeApiClient(CoreV1Api);
        this.kubeAppsApi = kc.makeApiClient(AppsV1Api);
        this.kubeNetworkApi = kc.makeApiClient(NetworkingV1Api);

        this.kubeConfig = kc;

        this.logger.log("KubeApiService initialized");
    }

    public getPod(namespace: string, name: string) {
        return this.kubeApi.readNamespacedPod(name, namespace);
    }

    public createNamespace(namespace: string, labels?: Record<string, string>, annotations?: Record<string, string>) {
        return this.kubeApi.createNamespace({
            metadata: {
                name: namespace,
                labels: labels,
                annotations: annotations,
            },
        });
    }

    public createPersistentVolumeClaim(namespace: string, name: string, storage?: string, accessModes?: string[], storageClassName?: string) {
        return this.kubeApi.createNamespacedPersistentVolumeClaim(namespace, {
            metadata: {
                name: name,
            },
            spec: {
                accessModes: accessModes || ["ReadWriteMany"],
                resources: {
                    requests: {
                        storage: storage || this.configService.get("workspace.defaultSpecs.storage"),
                    },
                },
                storageClassName: storageClassName || "",
            },
        });
    }

    public createDeployment(options: KubeCreateDeployment) {
        return this.kubeAppsApi.createNamespacedDeployment(options.namespace, {
            metadata: {
                name: options.name,
            },
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: {
                        app: options.name,
                    },
                },
                template: {
                    metadata: {
                        labels: {
                            app: options.name,
                        },
                    },
                    spec: {
                        containers: [
                            {
                                name: options.name,
                                image: options.image,
                                ports: options.ports,
                                imagePullPolicy: this.configService.get("env") === "production" ? "IfNotPresent" : "Always",
                                volumeMounts: options.volumeMounts,
                                env: options.env,
                                lifecycle: options.lifecycle,
                                resources: {
                                    limits: {
                                        cpu: options.resourceLimits?.cpu,
                                        memory: options.resourceLimits?.memory,
                                    },
                                    requests: {
                                        cpu: options.resourceRequests?.cpu,
                                        memory: options.resourceRequests?.memory,
                                    },
                                },
                            },
                        ],
                        volumes: options.volumes,
                    },
                },
            },
        });
    }

    public createIngress(namespace: string, name: string, host: string, path: string, serviceName: string, servicePort: number, enableTLS = true) {
        return this.kubeNetworkApi.createNamespacedIngress(namespace, {
            metadata: {
                name: name,
                annotations: {},
            },
            spec: {
                ingressClassName: "nginx",
                rules: [
                    {
                        host: host,
                        http: {
                            paths: [
                                {
                                    path: path,
                                    pathType: "Prefix",
                                    backend: {
                                        service: {
                                            name: serviceName,
                                            port: {
                                                number: servicePort,
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
                tls: enableTLS
                    ? [
                          {
                              hosts: [host],
                          },
                      ]
                    : [],
            },
        });
    }

    public createPod(namespace: string, data: V1Pod) {
        return this.kubeApi.createNamespacedPod(namespace, data);
    }

    public deleteDeployment(namespace: string, name: string) {
        return this.kubeAppsApi.deleteNamespacedDeployment(name, namespace);
    }

    public deleteNamespace(namespace: string) {
        return this.kubeApi.deleteNamespace(namespace);
    }

    public deletePod(namespace: string, name: string) {
        return this.kubeApi.deleteNamespacedPod(name, namespace);
    }

    // public async getNodeDescribe() {
    //     try {
    //         this.kubeApi.listNode()
    //         const { body: node } = await this.kubeApi.readNode("doan-cluster");
    //
    //         const resource = node.status.capacity;
    //         const capacity = {
    //             cpu: resource.cpu,
    //             memory: resource.memory,
    //         };
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
}
