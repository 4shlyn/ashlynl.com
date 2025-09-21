/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ashlynl.com' }],
        destination: 'https://ashlynl.com/:path*',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
