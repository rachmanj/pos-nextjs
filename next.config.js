/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: ".next",
  eslint: {
    // Do not run ESLint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Do not run type checking during build
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable file system scanning
    config.watchOptions = {
      ignored: ["**/*"],
    };

    // Disable file system access
    config.infrastructureLogging = {
      level: "error",
    };

    // Disable file system caching
    config.cache = false;

    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        "@/components": "./components",
        "@/lib": "./lib",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
