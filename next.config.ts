/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "http",
        hostname: "ruddacoffeeclub.ar",
        pathname: "/imagenes/**",
      },
      {
        protocol: "https",
        hostname: "ruddacoffeeclub.ar",
        pathname: "/imagenes/**",
      },
    ],
  },
};

export default nextConfig;