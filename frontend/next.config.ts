import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode to prevent double invocation issues with wallet adapters
  reactStrictMode: false,
  
  // Disable minification temporarily to debug WorkerError crashes during build
  // (This often bypasses issues with WASM-heavy packages in Next.js workers)
  swcMinify: false,

  // Exclude large WASM-heavy packages from server-side tracing
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@provablehq/**",
      "node_modules/@demox-labs/**",
    ],
  },

  webpack: (config, { isServer }) => {
    // WASM support setup
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Mark wallet adapter packages as external on the server side
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        /@provablehq\//,
        /@demox-labs\//,
      ];
    }

    // Fallback for Node.js built-ins in the browser
    if (!isServer) {
      config.resolve = config.resolve ?? {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        buffer: false,
      };
    }

    return config;
  },
};

export default nextConfig;
