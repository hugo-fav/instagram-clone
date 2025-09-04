/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    turbo: false, // disables Turbopack
  },
};

export default nextConfig;
