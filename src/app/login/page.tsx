// src/app/login/page.js
"use client"; // これをファイルの先頭に記述することで、Client Componentとして扱われます。

import React, { useState } from 'react';
import { auth } from '../../../lib/firebase'; // firebase.jsのパスに合わせて調整（相対パスに注意）
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // next/router から next/navigation に変更

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState(''); // YYYYMMDD形式
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // エラーメッセージをリセット
    try {
      // 誕生日をパスワードとして使用
      // Firebase Authenticationでは、パスワードは最低6文字以上必要です。
      // ユーザーの誕生日が6文字未満の場合（例: 20000101）はエラーになる可能性があります。
      // その場合は、誕生日をベースにしたより長い文字列をパスワードとして設定するか、
      // 別のパスワード設定方法を検討する必要があります。
      if (birthday.length < 6) {
        setError("誕生日（パスワード）は6文字以上で入力してください。");
        return;
      }
      await signInWithEmailAndPassword(auth, email, birthday);
      router.push('/'); // ログイン成功後、トップページへリダイレクト
    } catch (error) {
      // Firebaseのエラーコードを元にメッセージを分かりやすくする
      let errorMessage = "ログインに失敗しました。";
      if (error.code === 'auth/invalid-email') {
        errorMessage = "メールアドレスの形式が正しくありません。";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "メールアドレスまたは誕生日が間違っています。";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "短時間にログイン試行が多すぎます。しばらくしてからお試しください。";
      }
      setError(errorMessage);
      console.error("ログインエラー:", error.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>ログイン</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>メールアドレス:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label htmlFor="birthday" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', textAlign: 'left' }}>誕生日 (YYYYMMDD):</label>
            <input
              type="text"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              placeholder="例: 19830724"
              required
              maxLength="8"
              style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.1em',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            ログイン
          </button>
          {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;