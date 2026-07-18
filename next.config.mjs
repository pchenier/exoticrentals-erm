/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  staticPageGenerationTimeout: 600,
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
      {
        source: '/cars/bmw-x6m-competition',
        destination: '/car-rental-montreal',
        permanent: true,
      },
      {
        source: '/blog/bmw-x6m-competition-rental-montreal-aggressive-suv-performance',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/bmw-x6m-competition-montreal-price-specs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/bmw-x6m-competition-prix-specs-montreal',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/bmw-x6m-competition-montreal-night',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/bmw-x6m-nuit-montreal',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
