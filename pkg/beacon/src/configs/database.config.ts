export default () => ({
    database: {
        uri: process.env.DATABASE_URI || "",
        name: process.env.DATABASE_NAME || "",
    },
});
