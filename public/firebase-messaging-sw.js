// public/firebase-messaging-sw.js

// 파이어베이스 라이브러리를 백그라운드에 로드합니다.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 📌 선배님이 firebase.ts에서 찾으신 우리 앱만의 진짜 인증 키 세트입니다!
const firebaseConfig = {
  apiKey: "AIzaSyDEaMl5CcCrGeVQ90-m24BWiko4QgfGyZM",
  authDomain: "fami-a4eeb.firebaseapp.com",
  projectId: "fami-a4eeb",
  storageBucket: "fami-a4eeb.firebasestorage.app",
  messagingSenderId: "759029537488",
  appId: "1:759029537488:web:18635aa4375f3f72665cd5",
};

// 백그라운드 파이어베이스 엔진 초기화
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 앱이 백그라운드에 있거나 꺼져있을 때, AWS 백엔드에서 날아온 실시간 FCM 푸시 알림을 수신하는 로직입니다.
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM 백그라운드 수신] ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico' // 아까 404 떴던 파비콘 아이콘 위치를 매핑해 줍니다.
  };

  // 스마트폰 상단바에 푸시 알림 창을 진짜로 띄워줍니다.
  self.registration.showNotification(notificationTitle, notificationOptions);
});