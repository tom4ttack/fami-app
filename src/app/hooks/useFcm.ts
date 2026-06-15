import { useEffect, useCallback } from "react";
import { useApp } from "../context";
import type { PushNotif } from "../context";
import {
  requestPermissionAndGetToken,
  onForegroundMessage,
  extractLevel,
} from "../services/fcm";

/**
 * Firebase Cloud Messaging 초기화 훅.
 *
 * AppShell 에서 한 번만 호출하세요.
 * - 앱 로드 시: 이미 권한이 허용된 경우 자동으로 토큰을 발급하고 포그라운드 리스너를 등록합니다.
 * - requestPermission(): 권한 요청 버튼에 연결하여 사용자가 직접 허용할 때 호출합니다.
 */
export function useFcm() {
  const {
    setFcmToken,
    setNotifPermission,
    addPushNotif,
  } = useApp();

  const initFcm = useCallback(async () => {
    try {
      const token = await requestPermissionAndGetToken();
      // 권한 상태 동기화
      if ("Notification" in window) {
        setNotifPermission(Notification.permission);
      }
      if (!token) return;

      setFcmToken(token);
      console.info("[FCM] 토큰 발급 완료:", token);

      // 포그라운드 메시지 리스너 — 앱이 열려 있을 때 수신
      onForegroundMessage((payload) => {
        const notif: PushNotif = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          title: payload.notification?.title ?? payload.data?.title ?? "병해 알림",
          body: payload.notification?.body ?? payload.data?.body ?? "",
          time: new Date(),
          level: extractLevel(payload.data as Record<string, string> | undefined),
          zone: payload.data?.zone,
          data: payload.data as Record<string, string> | undefined,
          unread: true,
        };
        addPushNotif(notif);
      });
    } catch (err) {
      console.error("[FCM] 초기화 실패:", err);
    }
  }, [setFcmToken, setNotifPermission, addPushNotif]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) {
      setNotifPermission("unsupported");
      return;
    }

    // 현재 권한 상태를 즉시 반영
    setNotifPermission(Notification.permission);

    // 이미 허용된 경우 자동 초기화
    if (Notification.permission === "granted") {
      initFcm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    /** 알림 허용 버튼 등에 연결하여 권한 요청 + 토큰 발급을 트리거합니다. */
    requestPermission: initFcm,
  };
}
