import { useState } from "react";
import { Signal, Wifi, BatteryFull, Menu, Bell } from "lucide-react";
import { SideMenu } from "./components/side-menu";
import { NotificationPanel } from "./components/notification-panel";
import { DiagnosisSheet, DiagZone } from "./components/diagnosis-sheet";
import { BottomNav } from "./components/bottom-nav";
import { UserEditSheet, ParcelEditSheet } from "./components/edit-sheets";
import { HomeScreen } from "./screens/home";
import { ParcelDetails } from "./screens/parcel-details";
import { DiagnosisDashboard } from "./screens/diagnosis-dashboard";
import { LoginScreen } from "./screens/login";
import { OnboardingScreen } from "./screens/onboarding";
import { AppProvider, useApp, FONT_SCALES } from "./context";

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-neutral-900">
      <span className="text-[14px] tracking-tight" style={{ fontWeight: 600 }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryFull className="w-4 h-4" />
      </div>
    </div>
  );
}

const TITLES: Record<string, string> = {
  home: "농장 예찰 홈",
  parcel: "필지 상세",
  diag: "진단 대시보드",
};

function TopBar({
  title, onMenu, onBell, hasUnread,
}: {
  title: string; onMenu: () => void; onBell: () => void; hasUnread: boolean;
}) {
  return (
    <div className="px-5 pt-1.5 pb-3 flex items-center justify-between">
      <button
        onClick={onMenu}
        className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center active:bg-neutral-200/60 transition-colors"
      >
        <Menu className="w-[22px] h-[22px] text-neutral-900" />
      </button>
      <h1 className="text-neutral-900 tracking-tight" style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>
        {title}
      </h1>
      <button
        onClick={onBell}
        className="relative w-10 h-10 -mr-2 rounded-full flex items-center justify-center active:bg-neutral-200/60 transition-colors"
      >
        <Bell className="w-5 h-5 text-neutral-900" />
        {hasUnread && (
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-[#f5f5f3]"
            style={{ background: "#CF4F0E" }}
          />
        )}
      </button>
    </div>
  );
}

function AppShell() {
  const { stage, dark, fontScale } = useApp();
  const [tab, setTab] = useState("home");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [diagSheetZone, setDiagSheetZone] = useState<DiagZone | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userEditOpen, setUserEditOpen] = useState(false);
  const [parcelEditOpen, setParcelEditOpen] = useState(false);

  const scale = FONT_SCALES[fontScale];

  const goToZone = (zoneId: string | null) => {
    setSelectedZone(zoneId);
    setTab("parcel");
  };

  return (
    <div
      className={`size-full bg-neutral-200 overflow-hidden ${dark ? "app-dark" : ""}`}
      style={{
        fontFamily: '"Pretendard", "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        backgroundColor: dark ? "#0a0a0a" : undefined,
      }}
    >
      <div
        className="mx-auto w-full max-w-[412px] h-full bg-[#f5f5f3] relative overflow-hidden"
        style={{ zoom: scale } as React.CSSProperties}
      >
        {stage === "login" && <LoginScreen />}
        {stage === "onboarding" && <OnboardingScreen />}
        {stage === "app" && (
          <>
            <StatusBar />
            <TopBar
              title={TITLES[tab]}
              onMenu={() => setMenuOpen(true)}
              onBell={() => setNotifOpen(true)}
              hasUnread
            />

            <div className="absolute inset-0 top-[100px] bottom-[78px] overflow-y-auto">
              {tab === "home" && (
                <HomeScreen
                  onAllParcels={() => goToZone(null)}
                  onZoneSelect={goToZone}
                />
              )}
              {tab === "parcel" && (
                <ParcelDetails
                  initialSelectedId={selectedZone}
                  onInitialConsumed={() => setSelectedZone(null)}
                  onOpenDiagSheet={setDiagSheetZone}
                />
              )}
              {tab === "diag" && (
                <DiagnosisDashboard onOpenDiagSheet={setDiagSheetZone} />
              )}
            </div>

            {/* DiagnosisSheet is at root level — outside the scroll container */}
            <DiagnosisSheet
              open={diagSheetZone !== null}
              onClose={() => setDiagSheetZone(null)}
              zone={diagSheetZone ?? undefined}
            />

            <BottomNav
              active={tab}
              onChange={(t) => { setTab(t); if (t !== "parcel") setSelectedZone(null); }}
            />

            <SideMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onEditUser={() => setUserEditOpen(true)}
              onEditParcels={() => setParcelEditOpen(true)}
            />
            <NotificationPanel
              open={notifOpen}
              onClose={() => setNotifOpen(false)}
              onOpenDiagSheet={(zone) => {
                setSelectedZone(zone.zone);
                setTab("parcel");
                setDiagSheetZone(zone);
              }}
            />

            <UserEditSheet open={userEditOpen} onClose={() => setUserEditOpen(false)} />
            <ParcelEditSheet open={parcelEditOpen} onClose={() => setParcelEditOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
