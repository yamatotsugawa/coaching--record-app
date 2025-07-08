const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 修正点: PostCSSのオプションを明示的に設定するwebpack設定を削除
  // Next.jsは通常、postcss.config.jsとtailwind.config.jsを自動的に検出します。
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  },
};

module.exports = nextConfig;
