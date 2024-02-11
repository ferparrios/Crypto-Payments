/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains : ['localhost', 'payments.pre-bnvo.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'payments.pre-bnvo.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
  },
};



export default nextConfig;
