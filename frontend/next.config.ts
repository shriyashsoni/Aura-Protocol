import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ["@demox-labs/aleo-wallet-adapter-base", "@demox-labs/aleo-wallet-adapter-leo", "@demox-labs/aleo-wallet-adapter-react", "@provablehq/aleo-wallet-adaptor-shield", "@provablehq/aleo-wallet-adaptor-puzzle"],
  },
  webpack: (config, { isServer }) => {
    // WASM support setup
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Mark wallet adapter packages as external on the server side
    // This is crucial to prevent server-side WASM bundling issues
    if (isServer) {
        config.externals.push(/@provablehq\//, /@demox-labs\//);
    }

    // Fallback for Node.js built-ins in the browser
    if (!isServer) {
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
  turbopack: {
    resolveAlias: {
      "@/*": "./src/*",
    },
  },
};

export default nextConfig;
