"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@lib/firebase'; // Firebase Authのインスタンスを正しくインポート

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 修正点: 'const auth: Auth = getAuth();' の行を削除
  // 'auth' は既に '@lib/firebase' からインポートされており、
  // ここで再度 'getAuth()' を呼び出す必要はありません。

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (birthday.length < 6) {
        setError("誕生日（パスワード）は6文字以上で入力してください。");
        return;
      }
      await signInWithEmailAndPassword(auth, email, birthday);
      router.push('/');
    } catch (error: unknown) { // 修正点: 'any' を 'unknown' に変更
      let errorMessage = "ログインに失敗しました。";
      // error が Error インスタンスであるかを確認
      if (error instanceof Error) {
        // Firebase Auth エラーの場合、error.code を確認
        if ('code' in error && typeof error.code === 'string') {
          if (error.code === 'auth/invalid-email') {
            errorMessage = "メールアドレスの形式が正しくありません。";
          } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "メールアドレスまたは誕生日が間違っています。";
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "短時間にログイン試行が多すぎます。しばらくしてからお試しください。";
          }
        }
        console.error("ログインエラー:", error.message);
      } else {
        console.error("ログインエラー: 不明なエラー", error);
      }
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="誕生日（パスワード）"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      />
      <button type="submit">ログイン</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
