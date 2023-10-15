export const appConfig = () => ({
    env: process.env.NODE_ENV || "development",
    publicAppDomain: process.env.PUBLIC_APP_DOMAIN || "yds.cuterabbit.art",
    publicBeaconUrl: process.env.PUBLIC_BEACON_URL || "https://beacon.yds.cuterabbit.art",
    publicK8sExecUrl: process.env.PUBLIC_K8S_EXEC_URL || "https://exec.yds.cuterabbit.art",
});
