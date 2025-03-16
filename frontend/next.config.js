/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:8000/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://api:8000/api/auth/:path*',
      },
    ];
  },
}

module.exports = nextConfig 