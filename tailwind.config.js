/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind CSSを適用するファイルのパスを指定します。
  // ここに指定されたファイル内のクラス名がスキャンされ、CSSが生成されます。
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // srcディレクトリ以下の全てのファイル
  ],
  theme: {
    extend: {
      // ここにカスタムテーマ設定を追加できます（例: カスタムカラー、フォントサイズなど）
    },
  },
  plugins: [
    // ここにTailwind CSSのプラグインを追加できます（例: @tailwindcss/formsなど）
  ],
}
