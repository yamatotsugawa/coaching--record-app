// src/app/layout.tsx
import './globals.css'; // 既存のグローバルCSSのインポート

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* Tailwind CSS CDNの追加 */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Interフォントの追加（Tailwindと相性が良い） */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
