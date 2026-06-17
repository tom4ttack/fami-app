import { initializeApp, getApps, getApp } from "firebase/app";

// ─── Firebase 설정 ─────────────────────────────────────────────────────────────
// https://console.firebase.google.com
//   → 프로젝트 설정 → 일반 → 내 앱 → 웹 앱 추가 → 구성
//
// ⚠️ 아래 placeholder 를 실제 값으로 교체하세요.
//    vite.config.ts 의 서비스워커 설정도 동일하게 업데이트해야 합니다.
const firebaseConfig = {
  apiKey:            "AIzaSyDEaMl5CcCrGeVQ90-m24BWiko4QgfGyZM",
  authDomain:        "fami-a4eeb.firebaseapp.com",
  projectId:         "fami-a4eeb",
  storageBucket:     "fami-a4eeb.firebasestorage.app",
  messagingSenderId: "759029537488",
  appId:             "1:759029537488:web:18635aa4375f3f72665cd5",
};

// 중복 초기화 방지 (React StrictMode / HMR 환경)
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
