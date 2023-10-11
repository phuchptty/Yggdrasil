export const redisConfig = () => ({
    redis: {
        host: process.env.REDIS_HOST || "",
        port: process.env.REDIS_PORT || "",
        pass: process.env.REDIS_PASS || "",
    },
});
