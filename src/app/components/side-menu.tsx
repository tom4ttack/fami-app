import { X, User, Map as MapIcon, Moon, Type, ChevronRight, LogOut, Database } from "lucide-react";
import { useApp, FONT_LABELS, FontScale } from "../context";

type Props = {
  open: boolean;
  onClose: () => void;
  onEditUser: () => void;
  onEditParcels: () => void;
};

export function SideMenu({ open, onClose, onEditUser, onEditParcels }: Props) {
  const { dark, setDark, fontScale, setFontScale, mockData, setMockData, user, parcels, setStage } = useApp();

  const handleLogout = () => {
    onClose();
    setStage("login");
  };

  return (
    <>
      <div
        className={`absolute inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute top-0 bottom-0 left-0 z-50 w-[300px] bg-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-12 px-5 pb-4 text-white" style={{ background: "linear-gradient(to bottom right, var(--brand-green), #3a5235)" }}>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/25 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 active:bg-white/25 flex items-center justify-center"
              aria-label="close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p
            className="mt-3 text-[17px] tracking-tight"
            style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            {user.name || "사용자"} 님
          </p>
          <p className="text-[12px] text-white/75 tracking-tight">
            {user.region || "지역 미설정"} · {parcels.length} 필지 관리
          </p>
          {user.loginType && (
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10.5px] text-white tracking-tight" style={{ fontWeight: 600 }}>
              {user.loginType === "kakao" ? "카카오 로그인" : "Google 로그인"}
            </span>
          )}
        </div>

        <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: "calc(100% - 140px)" }}>
          <span className="px-2 text-[11px] text-neutral-400 tracking-tight" style={{ fontWeight: 600 }}>
            계정 및 농장
          </span>
          <div className="mt-2 rounded-[14px] bg-neutral-50 overflow-hidden">
            <Row
              icon={<User className="w-4 h-4" style={{ color: "var(--brand-green)" }} />}
              label="사용자 정보 수정"
              sub={user.name ? `${user.name} · ${user.phone || "전화 미입력"}` : "정보를 입력해주세요"}
              onClick={() => {
                onClose();
                onEditUser();
              }}
            />
            <Divider />
            <Row
              icon={<MapIcon className="w-4 h-4" style={{ color: "var(--brand-green)" }} />}
              label="필지 정보 수정"
              sub={`${parcels.length}개 필지 · 구역명 / 면적 / 작물`}
              onClick={() => {
                onClose();
                onEditParcels();
              }}
            />
          </div>

          <span className="mt-5 px-2 text-[11px] text-neutral-400 tracking-tight block" style={{ fontWeight: 600 }}>
            화면 설정
          </span>
          <div className="mt-2 rounded-[14px] bg-neutral-50 overflow-hidden">
            <div className="px-3.5 py-3 flex items-center gap-3">
              <Moon className="w-4 h-4" style={{ color: "var(--brand-green)" }} />
              <span className="flex-1 text-[14px] text-neutral-900 tracking-tight" style={{ fontWeight: 500 }}>
                다크모드
              </span>
              <button
                role="switch"
                aria-checked={dark}
                onClick={() => setDark(!dark)}
                className="relative w-[46px] h-[28px] rounded-full transition-colors"
                style={{ background: dark ? "var(--brand-green)" : "#d4d4d4" }}
              >
                <span
                  className="absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-white transition-transform"
                  style={{ transform: dark ? "translateX(18px)" : "translateX(0)" }}
                />
              </button>
            </div>
            <Divider />
            <div className="px-3.5 py-3">
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4" style={{ color: "var(--brand-green)" }} />
                <span className="flex-1 text-[14px] text-neutral-900 tracking-tight" style={{ fontWeight: 500 }}>
                  글자 크기
                </span>
                <span className="text-[11px] text-neutral-500 tracking-tight">
                  {FONT_LABELS[fontScale]}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                {([0, 1, 2, 3] as FontScale[]).map((i) => (
                  <button
                    key={i}
                    onClick={() => setFontScale(i)}
                    className={`flex-1 h-9 rounded-[10px] transition-all ${
                      fontScale === i ? "" : "bg-neutral-100"
                    }`}
                    style={
                      fontScale === i
                        ? { background: "#E9B44C", color: "#fff" }
                        : { color: "#1f1f1f" }
                    }
                  >
                    <span className="tracking-tight" style={{ fontSize: 11 + i * 2, fontWeight: 700 }}>
                      가
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[10.5px] text-neutral-400 tracking-tight">
                고령 사용자도 보기 편하게 4단계로 조절
              </p>
            </div>
          </div>

          <span className="mt-5 px-2 text-[11px] text-neutral-400 tracking-tight block" style={{ fontWeight: 600 }}>
            개발자 설정
          </span>
          <div className="mt-2 rounded-[14px] bg-neutral-50 overflow-hidden">
            <div className="px-3.5 py-3 flex items-center gap-3">
              <Database className="w-4 h-4" style={{ color: "var(--brand-green)" }} />
              <div className="flex-1 min-w-0">
                <span className="text-[14px] text-neutral-900 tracking-tight block" style={{ fontWeight: 500 }}>
                  샘플 데이터 표시
                </span>
                <span className="text-[10.5px] text-neutral-400 tracking-tight">
                  {mockData ? "백엔드 연결 전 미리보기 중" : "데이터 없음 상태 확인 중"}
                </span>
              </div>
              <button
                role="switch"
                aria-checked={mockData}
                onClick={() => setMockData(!mockData)}
                className="relative w-[46px] h-[28px] rounded-full transition-colors flex-shrink-0"
                style={{ background: mockData ? "var(--brand-green)" : "#d4d4d4" }}
              >
                <span
                  className="absolute top-[2px] left-[2px] w-6 h-6 rounded-full bg-white transition-transform"
                  style={{ transform: mockData ? "translateX(18px)" : "translateX(0)" }}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full h-11 rounded-[12px] bg-neutral-100 active:bg-neutral-200 flex items-center justify-center gap-2 text-[13px] text-neutral-700 tracking-tight"
            style={{ fontWeight: 500 }}
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>
    </>
  );
}

function Row({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3.5 py-3 flex items-center gap-3 active:bg-neutral-100 transition-colors"
    >
      {icon}
      <div className="flex-1 text-left min-w-0">
        <p className="text-[14px] text-neutral-900 tracking-tight" style={{ fontWeight: 500 }}>
          {label}
        </p>
        {sub && <p className="text-[11px] text-neutral-500 tracking-tight truncate">{sub}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-300" />
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-black/5 mx-3.5" />;
}
