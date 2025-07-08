const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 修正点: swcMinifyオプションを削除 (Next.js 15ではデフォルトで有効なため不要)
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  }
};

module.exports = nextConfig;
