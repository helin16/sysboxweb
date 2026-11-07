/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Outside sites the image optimiser may load from: blog covers,
    // Google reviewer photos and partner logos.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.showmine66.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "www.vultr.com" },
    ],
  },
};

export default nextConfig;
