/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '6pwxqfpcbd9gufxf.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
