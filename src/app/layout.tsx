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
        {/*
          Next.jsのApp Routerでは、同期スクリプト（例: Tailwind CSS CDNの<script>タグ）や
          <head>タグ内でのカスタムフォントの直接追加（例: Google Fontsの<link>タグ）は推奨されません。
          これらはビルドエラーやパフォーマンスの問題を引き起こす可能性があります。

          - Tailwind CSSは、通常プロジェクトにインストールし、`globals.css`に`@tailwind`ディレクティブを追加して使用します。
            CDNを使用する場合は、`next/script`コンポーネントを`strategy="beforeInteractive"`または`"lazyOnload"`で使用するか、
            `async`または`defer`属性を追加する必要がありますが、ベストプラクティスはプロジェクトへのインストールです。
          - Google Fontsのようなカスタムフォントは、`globals.css`に`@import`ルールで追加するか、
            Next.jsの`next/font`モジュールを使用するのが最適です。

          エラー解消のため、ここでは直接的な<script>タグと<link>タグ、<style>ブロックを削除します。
          これらの設定は、Next.jsの推奨する方法で別途行ってください。
        */}
      </head>
      <body>{children}</body>
    </html>
  );
}
