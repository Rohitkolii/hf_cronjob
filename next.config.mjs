/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Ensure API routes are properly included in build
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
