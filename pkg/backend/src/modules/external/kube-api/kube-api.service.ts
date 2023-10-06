import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AppsV1Api, CoreV1Api, KubeConfig, NetworkingV1Api, V1ContainerPort, V1ServicePort } from "@kubernetes/client-node";
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

    public createNamespace(namespace: string, labels?: Record<string, string>, annotations?: Record<string, string>) {
        return this.kubeApi.createNamespace({
            metadata: {
                name: namespace,
                labels: labels,
                annotations: annotations,
            },
        });
    }

    public createPersistentVolumeClaim(namespace: string, name: string, storage?: string) {
        return this.kubeApi.createNamespacedPersistentVolumeClaim(namespace, {
            metadata: {
                name: name,
            },
            spec: {
                accessModes: ["ReadWriteOnce"],
                resources: {
                    requests: {
                        storage: storage || this.configService.get("workspace.defaultSpecs.storage"),
                    },
                },
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
                            },
                        ],
                        volumes: options.volumes,
                    },
                },
            },
        });
    }

    public createService(namespace: string, name: string, ports: V1ServicePort[]) {
        return this.kubeApi.createNamespacedService(namespace, {
            metadata: {
                name: name,
            },
            spec: {
                selector: {
                    app: name,
                },
                ports: ports,
                type: "ClusterIP",
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

    public deleteDeployment(namespace: string, name: string) {
        return this.kubeAppsApi.deleteNamespacedDeployment(name, namespace);
    }

    public deleteNamespace(namespace: string) {
        return this.kubeApi.deleteNamespace(namespace);
    }
}
