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
    } catch (error: unknown) {
      let errorMessage = "ログインに失敗しました。";
      if (error instanceof Error) {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            メールアドレス:
          </label>
          <input
            type="email"
            id="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            誕生日（パスワード）:
          </label>
          <input
            type="password"
            id="password"
            placeholder="誕生日（パスワード）"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          ログイン
        </button>
        {error && <p className="text-red-500 text-xs italic mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}
