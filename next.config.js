/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/index.html',
        },
      ],
    }
  },
}

export default nextConfig
