import { createContext, useContext, useState, ReactNode } from "react";

export type Stage = "login" | "onboarding" | "app";
export type FontScale = 0 | 1 | 2 | 3; // 작게, 보통, 크게, 아주 크게

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
  const [user, setUser] = useState<User>({
    name: "",
    phone: "",
    region: "",
    loginType: null,
  });
  const [parcels, setParcels] = useState<Parcel[]>(DEFAULT_PARCELS);

  return (
    <AppCtx.Provider
      value={{ stage, setStage, dark, setDark, fontScale, setFontScale, mockData, setMockData, user, setUser, parcels, setParcels }}
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
