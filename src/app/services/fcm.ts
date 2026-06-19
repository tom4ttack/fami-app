import {
  getMessaging,
  getToken,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";
import { firebaseApp } from "./firebase";

// ─── VAPID 공개 키 ──────────────────────────────────────────────────────────────
export const VAPID_KEY = "BAGQ1fu4ZO4b7zgmAVdHUIc6Kj9UDeaYDu5oGxu51CiWkM1j0gIGmnsixE28_4FnQ_qgcYEw_KZpHYc_0vTitjg";

let _messaging: Messaging | null = null;

function getMessagingInstance(): Messaging | null {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  if (!_messaging) _messaging = getMessaging(firebaseApp);
  return _messaging;
}

/**
 * 브라우저 알림 권한을 요청하고 FCM 토큰을 반환합니다.
 */
export async function requestPermissionAndGetToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;
  if (!("serviceWorker" in navigator)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const messaging = getMessagingInstance();
  if (!messaging) return null;

  // 1. 서비스워커 등록
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
    { scope: "/" }
  );

  // 2. 서비스 워커가 완전히 준비될 때까지 대기
  await navigator.serviceWorker.ready;

  // 3. 토큰 발급
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token || null;
}

/**
 * 앱이 포그라운드(탭 활성)일 때 수신되는 FCM 메시지 리스너를 등록합니다.
 */
export function onForegroundMessage(
  cb: (payload: MessagePayload) => void
): (() => void) {
  const messaging = getMessagingInstance();
  if (!messaging) return () => {};
  return onMessage(messaging, cb);
}

/**
 * FCM 메시지 페이로드에서 알림 심각도를 추출합니다.
 */
export function extractLevel(
  data?: Record<string, string>
): "danger" | "warn" | "info" {
  if (!data?.level) return "info";
  if (data.level === "danger" || data.level === "warn") return data.level;
  return "info";
}