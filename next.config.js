const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 修正点: PostCSSのオプションを明示的に設定
  // Next.jsがTailwind CSSとAutoprefixerを確実に処理するようにします。
  webpack: (config, { isServer }) => {
    // CSSローダーの設定を調整してPostCSSを明示的に適用
    // Next.jsの内部CSS処理にPostCSSプラグインを注入
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader', // または MiniCssExtractPlugin.loader
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            },
          },
        },
      ],
      // Next.jsのApp Routerでは、CSSモジュールとグローバルCSSの扱いが異なるため、
      // 適切なexclude/includeルールを設定することが重要です。
      // 通常、globals.cssはグローバルとして扱われ、それ以外はCSSモジュールとして扱われます。
      // この設定はNext.jsのデフォルトのCSS処理を上書きするため、注意が必要です。
      // ほとんどの場合、Next.jsは自動的にPostCSSを検出するため、
      // このwebpack設定は最終手段としてのみ使用します。
    });

    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  },
};

module.exports = nextConfig;
