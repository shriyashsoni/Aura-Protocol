import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production-ready configuration */
  reactStrictMode: true,
  poweredByHeader: false,
  
  /* Image optimization */
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
  },

  /* Headers for security and performance */
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },

  /* Redirects and rewrites */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: "/api/v1/:path*",
          destination: "/api/v1/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
