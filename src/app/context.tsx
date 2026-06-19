import { createContext, useContext, useState, ReactNode } from "react";
import type { DiagnosisResult } from "./services/device-api";

export type Stage = "login" | "onboarding" | "app";
export type FontScale = 0 | 1 | 2 | 3; // 작게, 보통, 크게, 아주 크게
export type { DiagnosisResult };

/** FCM 으로 수신된 실시간 알림 */
export type PushNotif = {
  id: string;
  title: string;
  body: string;
  time: Date;
  level: "danger" | "warn" | "info";
  zone?: string;
  data?: Record<string, string>;
  unread: boolean;
};

export type User = {
  name: string;
  phone: string;
  region: string;
  loginType: "kakao" | "google" | null;
};

export type Parcel = {
  id: string;
  name: string;
  area: string;
  crop: string;
  coordinates?: { lat: number; lng: number }[];
  center?: { lat: number; lng: number };
};

type Ctx = {
  stage: Stage;
  setStage: (s: Stage) => void;

  dark: boolean;
  setDark: (v: boolean) => void;

  fontScale: FontScale;
  setFontScale: (v: FontScale) => void;

  mockData: boolean;
  setMockData: (v: boolean) => void;

  user: User;
  setUser: (u: User) => void;

  parcels: Parcel[];
  setParcels: (p: Parcel[]) => void;

  notificationRadius: number;
  setNotificationRadius: (r: number) => void;

  captureRunning: boolean;
  setCaptureRunning: (v: boolean) => void;
  liveImageTs: number;
  setLiveImageTs: (v: number) => void;
  liveDiagnosis: DiagnosisResult | null;
  setLiveDiagnosis: (v: DiagnosisResult | null) => void;

  // ─── FCM ─────────────────────────────────────────────────────────────────
  fcmToken: string | null;
  setFcmToken: (t: string | null) => void;
  /** "default" | "granted" | "denied" | "unsupported" | null(미확인) */
  notifPermission: NotificationPermission | "unsupported" | null;
  setNotifPermission: (p: NotificationPermission | "unsupported" | null) => void;
  pushNotifs: PushNotif[];
  addPushNotif: (n: PushNotif) => void;
  markAllPushRead: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export const FONT_SCALES: Record<FontScale, number> = {
  0: 0.9,
  1: 1,
  2: 1.14,
  3: 1.28,
};

export const FONT_LABELS: Record<FontScale, string> = {
  0: "작게",
  1: "보통",
  2: "크게",
  3: "아주 크게",
};

const DEFAULT_PARCELS: Parcel[] = [
  { id: "A-1", name: "A-1 구역", area: "310", crop: "청양고추" },
  { id: "A-2", name: "A-2 구역", area: "295", crop: "청양고추" },
  { id: "A-3", name: "A-3 구역", area: "280", crop: "청양고추" },
  { id: "B-3", name: "B-3 구역", area: "330", crop: "청양고추" },
  { id: "B-4", name: "B-4 구역", area: "320", crop: "청양고추" },
  { id: "B-5", name: "B-5 구역", area: "300", crop: "청양고추" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("login");
  const [dark, setDark] = useState(false);
  const [fontScale, setFontScale] = useState<FontScale>(1);
  const [mockData, setMockData] = useState(true);
  
  // 🚨 [수정 완료] 초기 시작값을 5km에서 새로운 최소 기준인 0.1km(100m)로 변경했습니다!
  const [notificationRadius, setNotificationRadius] = useState(0.1);
  
  const [user, setUser] = useState<User>({
    name: "",
    phone: "",
    region: "",
    loginType: null,
  });
  const [parcels, setParcels] = useState<Parcel[]>(DEFAULT_PARCELS);
  const [captureRunning, setCaptureRunning] = useState(false);
  const [liveImageTs, setLiveImageTs] = useState(0);
  const [liveDiagnosis, setLiveDiagnosis] = useState<DiagnosisResult | null>(null);

  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "unsupported" | null>(null);
  const [pushNotifs, setPushNotifs] = useState<PushNotif[]>([]);

  const addPushNotif = (n: PushNotif) =>
    setPushNotifs((prev) => [n, ...prev].slice(0, 50)); // 최대 50개 유지

  const markAllPushRead = () =>
    setPushNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <AppCtx.Provider
      value={{
        stage, setStage,
        dark, setDark,
        fontScale, setFontScale,
        mockData, setMockData,
        user, setUser,
        parcels, setParcels,
        notificationRadius, setNotificationRadius,
        captureRunning, setCaptureRunning,
        liveImageTs, setLiveImageTs,
        liveDiagnosis, setLiveDiagnosis,
        fcmToken, setFcmToken,
        notifPermission, setNotifPermission,
        pushNotifs, addPushNotif, markAllPushRead,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}