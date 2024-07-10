/** @type {import('next').NextConfig} */
const nextConfig = {
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
