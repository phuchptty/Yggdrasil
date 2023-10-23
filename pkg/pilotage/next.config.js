/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    rewrites: async () => [
        {
            source: '/',
            destination: '/home',
        },
    ],
    publicRuntimeConfig: {
        SITE_URL: process.env.SITE_URL,
        NEXT_PUBLIC_CODE_RUNNER_URL: process.env.NEXT_PUBLIC_CODE_RUNNER_URL,
    },
};

module.exports = nextConfig;
