"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, Auth } from "firebase/auth";

interface FirebaseError extends Error {
  code?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState<string | null>(null);

  const auth: Auth = getAuth();

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
    } catch (error) {
      let errorMessage = "ログインに失敗しました。";
      
      const firebaseError = error as FirebaseError;
      
      if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = "メールアドレスの形式が正しくありません。";
      } else if (
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/wrong-password'
      ) {
        errorMessage = "メールアドレスまたは誕生日が間違っています。";
      } else if (firebaseError.code === 'auth/too-many-requests') {
        errorMessage = "短時間にログイン試行が多すぎます。しばらくしてからお試しください。";
      }

      setError(errorMessage);
      console.error("ログインエラー:", firebaseError.message);
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