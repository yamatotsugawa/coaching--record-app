// src/app/layout.tsx
// グローバルCSSのインポート
import './globals.css';

// Next.jsのnext/font/googleからInterフォントをインポート
import { Inter } from 'next/font/google';

// Interフォントのロード
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* headタグ内は最小限に。CSSは通常import './globals.css'でバンドルされます。 */}
      </head>
      {/* bodyにInterフォントのクラスを適用 */}
      {/* Tailwind CSSでfont-interを使用できるようにします */}
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
