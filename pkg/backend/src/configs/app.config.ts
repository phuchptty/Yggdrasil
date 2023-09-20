export const appConfig = () => ({
    env: process.env.NODE_ENV || "development",
    constant: {
        playgroundBucketName: process.env.PLAYGROUND_BUCKET_NAME || "tek4-playground-dev",
    },
});
