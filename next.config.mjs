/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Bypasses server-side image fetching & processing
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;