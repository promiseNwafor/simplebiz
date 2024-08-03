/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
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
