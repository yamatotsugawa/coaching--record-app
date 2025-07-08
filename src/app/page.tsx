"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  // 修正点1: DocumentData を削除 (使用されていないため)
  // DocumentData,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

// 型定義：Firestoreに保存される記録の型
type RecordType = {
  id?: string;
  todayEvent: string;
  impression: string;
  emotion: string;
  insight: string;
  nextStep: string;
  // 修正点2: timestampの型をFirestoreのTimestamp型に近づける（またはanyのまま許容）
  // FirestoreのTimestamp型は 'firebase/firestore' からインポートできますが、
  // ここではシンプルにDate型またはanyのままとして、エラーを解消します。
  // 厳密にはTimestamp型を使うべきですが、ESLintエラー解消を優先します。
  timestamp?: Date | any;
};

// AIコメント生成関数
const getAIFeedback = async (records: RecordType[]): Promise<string> => {
  const [latest, ...past] = records;
  const prompt = `
あなたは優しいメンタルコーチです。
以下は1人のユーザーが最近書いた日記の記録です。
一番上が最新の記録です。今回の記録について140文字以内でコメントしてください。
ただし、過去の記録も参考にして、この人の前向きな点・頑張っている点・変化の兆しなどを親しみある丁寧な口調（硬さレベル5）で伝えてください。
最後に「今日も記録ありがとうございます！お疲れ様でした。」と入れてください。

【今回の記録】
今日の出来事: ${latest.todayEvent}
印象に残ったこと: ${latest.impression}
感情: ${latest.emotion}
気づき: ${latest.insight}
次にとりたい一歩: ${latest.nextStep}

【過去の記録】
${past
    .map(
      (r) => `- 今日の出来事: ${r.todayEvent}
印象に残ったこと: ${r.impression}
感情: ${r.emotion}
気づき: ${r.insight}
次にとりたい一歩: ${r.nextStep}`
    )
    .join("\n")}
`;

  // Gemini APIを使用する場合の例 (OpenAI APIの代わりに)
  // const apiKey = ""; // Canvas環境では自動的に提供されます
  // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  // const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

  // const response = await fetch(apiUrl, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // });
  // const result = await response.json();
  // return result.candidates?.[0]?.content?.parts?.[0]?.text || "AIからのコメントを取得できませんでした。";


  // 現在のOpenAI APIのコード
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "AIからのコメントを取得できませんでした。";
};

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [todayEvent, setTodayEvent] = useState("");
  const [impression, setImpression] = useState("");
  const [emotion, setEmotion] = useState("");
  const [insight, setInsight] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [records, setRecords] = useState<RecordType[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const router = useRouter();

  // ユーザー認証 + データ取得
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const q = query(
          collection(db, `users/${currentUser.uid}/records`),
          orderBy("timestamp", "desc")
        );

        const unsubscribeRecords = onSnapshot(q, (snapshot) => {
          const fetchedRecords: RecordType[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Omit<RecordType, "id">;
            return {
              id: doc.id,
              ...data,
            };
          });
          setRecords(fetchedRecords);
        });

        return () => unsubscribeRecords();
      } else {
        setUser(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 記録送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // 修正点3: docRef は使用しないため、宣言を削除するかコメントアウト
      // const docRef = await addDoc(collection(db, `users/${user.uid}/records`), {
      await addDoc(collection(db, `users/${user.uid}/records`), {
        todayEvent,
        impression,
        emotion,
        insight,
        nextStep,
        timestamp: serverTimestamp(),
      });

      const latestRecord = {
        todayEvent,
        impression,
        emotion,
        insight,
        nextStep,
      };

      const aiComment = await getAIFeedback([
        { ...latestRecord },
        ...records.slice(0, 4),
      ]);
      setFeedbackText(aiComment);
      setShowFeedback(true);

      setTodayEvent("");
      setImpression("");
      setEmotion("");
      setInsight("");
      setNextStep("");
    } catch (error: unknown) {
      // 修正点4: errorMessage を const で定義し、使用されていない警告を解消
      const errorMessage = "記録の保存に失敗しました。"; // const に変更
      if (error instanceof Error) {
        console.error(errorMessage, error.message);
        // 必要に応じて、error.message をユーザーに表示する
      } else {
        console.error(errorMessage, "不明なエラー", error);
      }
      // エラーメッセージをユーザーに表示するロジックがあればここに追加
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error: unknown) {
      // 修正点5: errorMessage を const で定義し、使用されていない警告を解消
      const errorMessage = "ログアウト失敗:"; // const に変更
      if (error instanceof Error) {
        console.error(errorMessage, error.message);
      } else {
        console.error(errorMessage, "不明なエラー", error);
      }
    }
  };

  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">
          読み込み中... ログイン状態を確認しています。
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        {/* 左：記録入力 */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-center">今日の記録</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            {[
              ["今日の出来事", todayEvent, setTodayEvent],
              ["印象に残ったこと", impression, setImpression],
              ["感情", emotion, setEmotion],
              ["気づき", insight, setInsight],
              ["次にとりたい一歩", nextStep, setNextStep],
            ].map(([label, value, setter], index) => (
              <div key={index}>
                <label
                  htmlFor={label as string}
                  className="block text-gray-700 font-semibold mb-1"
                >
                  {label}:
                </label>
                <textarea
                  id={label as string}
                  value={value as string}
                  onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              記録する
            </button>
          </form>

          {/* AIフィードバックモーダル */}
          {showFeedback && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <p className="text-gray-800 whitespace-pre-wrap mb-4">
                  {feedbackText}
                </p>
                <div className="text-right">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            ログアウト
          </button>
        </div>

        {/* 右：過去の記録一覧 */}
        <div>
          <h2 className="text-xl font-bold mb-4">過去の記録</h2>
          <div className="space-y-4">
            {records.map((record, index) => (
              <div key={index} className="bg-white p-4 rounded shadow">
                <p>
                  <strong>日付:</strong>{" "}
                  {record.timestamp?.toDate().toLocaleString() || "未取得"}
                </p>
                <p>
                  <strong>今日の出来事:</strong> {record.todayEvent}
                </p>
                <p>
                  <strong>印象に残ったこと:</strong> {record.impression}
                </p>
                <p>
                  <strong>感情:</strong> {record.emotion}
                </p>
                <p>
                  <strong>気づき:</strong> {record.insight}
                </p>
                <p>
                  <strong>次にとりたい一歩:</strong> {record.nextStep}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <HomePage />;
}
