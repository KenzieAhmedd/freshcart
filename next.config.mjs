/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ecommerce.routemisr.com" },
    ],
  },
  async redirects() {
    return [
      // Stripe returns here after online payment (see README)
      { source: "/allorders", destination: "/orders", permanent: false },
      { source: "/profile/orders", destination: "/orders", permanent: false },
    ];
  },
};

export default nextConfig;
