import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  turbopack: {
    root: __dirname,
  },
  
  // API Proxy - Forward /api requests to backend
  rewrites() {
    return [
      {
        source: '/api/:path*/',      // WITH trailing slash
        destination: 'http://localhost:8000/api/:path*/',
      },
      {
        source: '/api/:path*',       // WITHOUT trailing slash
        destination: 'http://localhost:8000/api/:path*/',
      },
    ];
  },
};

export default nextConfig;