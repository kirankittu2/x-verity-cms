/** @type {import('next').NextConfig} */
const TerserPlugin = require("terser-webpack-plugin");

const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/files/:path*",
        destination: "http://localhost:3001/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/articles",
        destination: "/dashboard/articles/list-of-articles",
        permanent: true,
      },
      {
        source: "/dashboard/pages",
        destination: "/dashboard/pages/list-of-pages",
        permanent: true,
      },
      {
        source: "/dashboard/case_studies",
        destination: "/dashboard/case_studies/list-of-case-studies",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
          },
        }),
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
