/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['svix'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
