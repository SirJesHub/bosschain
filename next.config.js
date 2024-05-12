/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // Configure remote image optimization
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
          port: '',
          pathname: '**',
        },
      ],
    },
    // Your other Next.js configuration options
  };


module.exports = nextConfig