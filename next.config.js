// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@": path.resolve(__dirname, "src"), // これもよければ追加
    };
    return config;
  },
};

module.exports = nextConfig;
