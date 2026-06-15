import {
  getMessaging,
  getToken,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";
import { firebaseApp } from "./firebase";

// ─── VAPID 공개 키 ──────────────────────────────────────────────────────────────
// Firebase 콘솔 → 프로젝트 설정 → 클라우드 메시지 → 웹 푸시 인증서 → 키 쌍 생성
// ⚠️ 아래 placeholder 를 실제 VAPID 키로 교체하세요.
export const VAPID_KEY = "YOUR_VAPID_PUBLIC_KEY";

let _messaging: Messaging | null = null;

function getMessagingInstance(): Messaging | null {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  if (!_messaging) _messaging = getMessaging(firebaseApp);
  return _messaging;
}

/**
 * 브라우저 알림 권한을 요청하고 FCM 토큰을 반환합니다.
 * 권한 거부 또는 미지원 환경이면 null 을 반환합니다.
 */
export async function requestPermissionAndGetToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;
  if (!("serviceWorker" in navigator)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const messaging = getMessagingInstance();
  if (!messaging) return null;

  // 서비스워커가 등록될 때까지 대기
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
    { scope: "/" }
  );

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token || null;
}

/**
 * 앱이 포그라운드(탭 활성)일 때 수신되는 FCM 메시지 리스너를 등록합니다.
 * 반환된 unsubscribe 함수를 호출하면 해제됩니다.
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
 * 서버에서 data.level 에 "danger" | "warn" | "info" 를 넣어줘야 합니다.
 */
export function extractLevel(
  data?: Record<string, string>
): "danger" | "warn" | "info" {
  if (!data?.level) return "info";
  if (data.level === "danger" || data.level === "warn") return data.level;
  return "info";
}
