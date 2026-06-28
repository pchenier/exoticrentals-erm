/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog/location-mclaren-montreal',
        destination: '/cars/mclaren-600lt',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
