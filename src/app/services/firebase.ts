import { initializeApp, getApps, getApp } from "firebase/app";

// ─── Firebase 설정 ─────────────────────────────────────────────────────────────
// https://console.firebase.google.com
//   → 프로젝트 설정 → 일반 → 내 앱 → 웹 앱 추가 → 구성
//
// ⚠️ 아래 placeholder 를 실제 값으로 교체하세요.
//    vite.config.ts 의 서비스워커 설정도 동일하게 업데이트해야 합니다.
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// 중복 초기화 방지 (React StrictMode / HMR 환경)
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
