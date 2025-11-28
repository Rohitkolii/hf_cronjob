/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Ensure API routes are properly included in build
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: undefined,
};

export default nextConfig;
