export const appConfig = () => ({
    env: process.env.NODE_ENV || "development",
    fsPath: process.env.FS_PATH || "/",
});
