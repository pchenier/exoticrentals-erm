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
        source: '/blog/exotic-car-rental-ahuntsic-north-montreal-supercar-delivery',
        destination: '/locations/ahuntsic',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-brossard-luxury-cars-on-the-south-shore',
        destination: '/locations/brossard',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-brossard-supercar-delivery-in-the-south-shore',
        destination: '/locations/brossard',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-griffintown-luxury-cars-in-montreal-s-hottest-neighbourhood',
        destination: '/locations/griffintown',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-laval-supercars-delivered-north-of-montreal',
        destination: '/locations/laval',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-laval-supercar-delivery-on-the-north-shore',
        destination: '/locations/laval',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-longueuil-south-shore-luxury-delivery',
        destination: '/locations/longueuil',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-longueuil-south-shore-supercar-delivery',
        destination: '/locations/longueuil',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-mount-royal-supercar-delivery-on-the-mountain',
        destination: '/locations/plateau-mont-royal',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-vieux-montreal-supercars-in-the-old-port-district',
        destination: '/locations/old-montreal',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-westmount-premium-cars-for-montreal-s-best-neighbourhood',
        destination: '/locations/westmount',
        permanent: true,
      },
      {
        source: '/blog/exotic-car-rental-westmount-luxury-supercar-delivery-in-west-montreal',
        destination: '/locations/westmount',
        permanent: true,
      },
      {
        source: '/blog/location-voiture-exotique-vieux-montreal',
        destination: '/locations/old-montreal',
        permanent: true,
      },
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