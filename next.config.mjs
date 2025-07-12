/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['fakestoreapi.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Fix untuk deployment
  output: 'standalone',
  trailingSlash: false,
  // Ensure proper routing for dynamic pages
  async rewrites() {
    return [
      {
        source: '/product/:id',
        destination: '/product/:id',
      },
    ]
  },
  // Remove any v0 related configurations
  poweredByHeader: false,
}

export default nextConfig
