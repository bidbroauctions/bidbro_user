/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com", // Allow all paths under the s3.amazonaws.com domain
        pathname: "/**", // Allow all sub-paths
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com", // You already have this entry
        pathname: "/**", // Allow all paths under this domain
      },
      {
        protocol: "https",
        hostname: "abc.xyz",
        pathname: "/**", // Allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;
