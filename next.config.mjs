/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ufd-dev-asset-uploads.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ]
  },
};

export default nextConfig;
