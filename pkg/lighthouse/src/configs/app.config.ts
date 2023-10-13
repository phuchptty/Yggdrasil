export const appConfig = () => ({
    env: process.env.NODE_ENV || "development",
    publicAppDomain: process.env.PUBLIC_APP_DOMAIN || "yds.cuterabbit.art",
    publicBeaconUrl: process.env.PUBLIC_BEACON_URL || "https://beacon.yds.cuterabbit.art",
});
