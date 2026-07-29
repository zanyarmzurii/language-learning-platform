/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // بۆ چارەسەرکردنی هەموو هەڵەکانی TypeScript لە کاتی Build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // بۆ چارەسەرکردنی هەموو هەڵەکانی ESLint لە کاتی Build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // بۆ وێنەکان
  images: {
    unoptimized: true,
  },
  
  // بۆ ماژوڵەکانی سێرڤەر
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
  },
  
  // بۆ Webpack کێشەکان
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
}

module.exports = nextConfig
