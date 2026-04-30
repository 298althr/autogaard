/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'exquisite-insight-production.up.railway.app',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.autoevolution.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
                pathname: '/**',
            }
        ],
    },
    async redirects() {
        return [];
    },
};

module.exports = nextConfig;
