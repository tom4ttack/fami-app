/**
 * Empty state components for each data-driven section.
 * When the backend is connected, replace mock data with real API calls.
 * These components are shown when the data array is empty.
 */

import { Map, Bell, ScanSearch, Camera, BarChart2, FileSearch } from "lucide-react";

type EmptyProps = { className?: string };

function EmptyBase({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  desc,
  action,
  height,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
  action?: React.ReactNode;
  height?: number;
}) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-3 rounded-[16px] bg-white"
      style={{ minHeight: height ?? 200 }}
    >
      <div
        className="w-14 h-14 rounded-[16px] flex items-center justify-center"
        style={{ background: iconBg }}
      >
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>
      <div className="text-center px-6">
        <p className="text-[15px] text-neutral-900 tracking-tight" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          {title}
        </p>
        <p className="mt-1 text-[12.5px] text-neutral-500 tracking-tight" style={{ lineHeight: 1.5 }}>
          {desc}
        </p>
      </div>
      {action}
    </div>
  );
}

/** 홈 화면 — 오늘의 진단 요약 없음 */
export function EmptyTodaySummary({ className }: EmptyProps) {
  return (
    <div className={`rounded-[16px] bg-white p-4 ${className ?? ""}`}>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <span className="text-[11.5px] text-neutral-400 tracking-tight">오늘의 진단 요약</span>
      </div>
      <div className="mt-4 flex flex-col items-center py-4 gap-3">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)" }}
        >
          <ScanSearch className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
        </div>
        <div className="text-center">
          <p className="text-[14.5px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
            아직 오늘의 예찰이 없어요
          </p>
          <p className="mt-0.5 text-[12px] text-neutral-400 tracking-tight">
            AI 진단을 시작하면 결과가 여기에 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

/** 홈 화면 — 팜맵 필지 없음 */
export function EmptyFarmMap({ className }: EmptyProps) {
  return (
    <div
      className={`relative w-full rounded-[16px] overflow-hidden bg-gradient-to-br from-[#eef2ea] via-[#e3ead9] to-[#d4dfc5] flex flex-col items-center justify-center gap-3 ${className ?? ""}`}
      style={{ height: 270 }}
    >
      {/* 배경 그리드 */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="emptyGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--brand-green)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#emptyGrid)" />
      </svg>
      <div
        className="relative z-10 w-14 h-14 rounded-[16px] flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.8)" }}
      >
        <Map className="w-6 h-6" style={{ color: "var(--brand-green)" }} />
      </div>
      <div className="relative z-10 text-center px-8">
        <p className="text-[15px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 700 }}>
          등록된 필지가 없어요
        </p>
        <p className="mt-1 text-[12px] text-neutral-600 tracking-tight">
          필지를 등록하면 팜맵에 구역이 표시됩니다
        </p>
      </div>
    </div>
  );
}

/** 알림 패널 — 알림 없음 */
export function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className="w-14 h-14 rounded-[16px] flex items-center justify-center"
        style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)" }}
      >
        <Bell className="w-6 h-6" style={{ color: "var(--brand-green)" }} />
      </div>
      <div className="text-center px-6">
        <p className="text-[14.5px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
          새로운 알림이 없어요
        </p>
        <p className="mt-1 text-[12px] text-neutral-500 tracking-tight" style={{ lineHeight: 1.5 }}>
          위험·주의 구역이 감지되면{"\n"}여기에 알림이 표시됩니다
        </p>
        <div
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-tight"
          style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)", color: "var(--brand-green)", fontWeight: 600 }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-green)" }} />
          모든 구역 안전
        </div>
      </div>
    </div>
  );
}

/** 진단 대시보드 — 진단 데이터 없음 (상단 요약 카드) */
export function EmptyDiagSummaryCard() {
  return (
    <div className="rounded-[16px] bg-white p-4">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <span className="text-[11.5px] text-neutral-400 tracking-tight">사진 진단 분석 · 날짜별</span>
      </div>
      <p className="mt-1 tracking-tight text-neutral-900" style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>
        병해별 그룹 분석
      </p>
      <div className="mt-4 flex flex-col items-center py-3 gap-3">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)" }}
        >
          <BarChart2 className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
        </div>
        <div className="text-center">
          <p className="text-[14px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
            선택한 날짜의 진단 데이터가 없어요
          </p>
          <p className="mt-0.5 text-[11.5px] text-neutral-400 tracking-tight">
            AI 진단 후 결과가 여기에 그룹별로 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

/** 진단 대시보드 — 병해별 진단 결과 리스트 없음 */
export function EmptyDiagResultList() {
  return (
    <EmptyBase
      icon={Camera}
      iconColor="#E9B44C"
      iconBg="rgba(233,180,76,0.12)"
      title="아직 진단 결과가 없어요"
      desc={"AI 예찰을 시작하면 병해별로\n분류된 진단 결과가 여기에 표시됩니다"}
      height={220}
    />
  );
}

/** 필지 상세 — 전체 필지 목록 없음 */
export function EmptyParcelList() {
  return (
    <EmptyBase
      icon={Map}
      iconColor="var(--brand-green)"
      iconBg="color-mix(in srgb, var(--brand-green) 10%, transparent)"
      title="등록된 필지가 없어요"
      desc={"메뉴에서 필지를 등록하면\n구역별 상태를 한눈에 확인할 수 있어요"}
      height={240}
    />
  );
}

/** 필지 상세 (구역 선택 후) — 사진 진단 이력 없음 */
export function EmptyDiagHistory() {
  return (
    <div className="rounded-[14px] bg-white p-5 flex flex-col items-center gap-3">
      <div
        className="w-11 h-11 rounded-[13px] flex items-center justify-center"
        style={{ background: "color-mix(in srgb, var(--brand-green) 10%, transparent)" }}
      >
        <FileSearch className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
      </div>
      <div className="text-center">
        <p className="text-[13.5px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
          아직 진단 이력이 없어요
        </p>
        <p className="mt-0.5 text-[11.5px] text-neutral-500 tracking-tight">
          이 필지에서 AI 진단을 시작해보세요
        </p>
      </div>
    </div>
  );
}
