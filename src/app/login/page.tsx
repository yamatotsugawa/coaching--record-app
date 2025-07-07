"use client"; 
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null); // エラーメッセージをリセット
  try {
    if (birthday.length < 6) {
      setError("誕生日（パスワード）は6文字以上で入力してください。");
      return;
    }
    await signInWithEmailAndPassword(auth, email, birthday);
    router.push('/'); // ログイン成功後、トップページへリダイレクト
  } catch (error: any) {
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
