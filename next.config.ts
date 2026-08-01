import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns:[
      {
        hostname: "encrypted-tbn0.gstatic.com"
      },
      {
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
