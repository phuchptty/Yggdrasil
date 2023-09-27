export const databaseConfig = () => ({
    database: {
        uri: process.env.DATABASE_URI || "",
        name: process.env.DATABASE_NAME || "",
    },
    redis: {
        host: process.env.REDIS_HOST || "",
        port: process.env.REDIS_PORT || "",
        pass: process.env.REDIS_PASS || "",
    },
});
