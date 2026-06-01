import { useState, useEffect } from "react";
import { ChevronRight, Sprout, Ruler, Check, CheckCircle2, ChevronLeft, Hand } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DiagZone } from "../components/diagnosis-sheet";
import { EmptyParcelList, EmptyDiagHistory } from "../components/empty-states";
import { useApp } from "../context";

type ParcelState = "danger" | "warn" | "safe";

type Parcel = {
  id: string;
  state: ParcelState;
  name: string;
  area: string;
  crop: string;
  note: string;
  d: string;
  labelX: number;
  labelY: number;
};

const PARCELS: Parcel[] = [
  { id: "A-1", state: "safe",   name: "A-1 구역", area: "310㎡", crop: "청양고추", note: "안전",         d: "M28,32 L162,28 L168,108 L34,116 Z",    labelX: 92,  labelY: 76  },
  { id: "A-2", state: "safe",   name: "A-2 구역", area: "295㎡", crop: "청양고추", note: "안전",         d: "M180,28 L308,32 L302,112 L172,108 Z",  labelX: 238, labelY: 76  },
  { id: "A-3", state: "warn",   name: "A-3 구역", area: "280㎡", crop: "청양고추", note: "흰가루병 주의", d: "M316,34 L342,36 L340,114 L308,114 Z",  labelX: 325, labelY: 80  },
  { id: "B-3", state: "danger", name: "B-3 구역", area: "330㎡", crop: "청양고추", note: "탄저병",       d: "M30,130 L168,124 L176,236 L40,246 Z",  labelX: 100, labelY: 188 },
  { id: "B-4", state: "danger", name: "B-4 구역", area: "320㎡", crop: "청양고추", note: "탄저병 의심",  d: "M188,124 L306,128 L300,238 L180,234 Z", labelX: 244, labelY: 188 },
  { id: "B-5", state: "safe",   name: "B-5 구역", area: "300㎡", crop: "청양고추", note: "안전",         d: "M318,130 L342,132 L338,240 L310,240 Z", labelX: 326, labelY: 188 },
  { id: "C-1", state: "warn",   name: "C-1 구역", area: "260㎡", crop: "청양고추", note: "흰가루병 의심", d: "M30,258 L130,254 L134,330 L34,334 Z",  labelX: 82,  labelY: 298 },
];

const TONE: Record<ParcelState, { color: string; label: string; emoji: string }> = {
  danger: { color: "#CF4F0E", label: "위험", emoji: "🔴" },
  warn:   { color: "#E9B44C", label: "주의", emoji: "🟡" },
  safe:   { color: "var(--brand-green)", label: "안전", emoji: "🟢" },
};

type HistoryItem = {
  date: string;
  time: string;
  state: ParcelState;
  label: string;
  photo: string;
  diagZone?: DiagZone;
};

const HISTORY: HistoryItem[] = [
  {
    date: "2026.05.16", time: "09:38", state: "danger", label: "탄저병 검출 · 92%",
    photo: "https://images.unsplash.com/photo-1518568403628-df55701ade9e?w=400&q=80",
    diagZone: {
      zone: "B-3", accuracy: 92, area: 15,
      photo: "https://images.unsplash.com/photo-1518568403628-df55701ade9e?w=900&q=80",
      time: "09:38", treat: "1-2일 내 방제 권장",
      disease: "탄저병", diseaseEn: "Anthracnose", color: "#CF4F0E",
      drugs: [
        { name: "안트라콜",    primary: true, reason: "탄저병 전문 예방·치료제. 잔류효과 길고 우천 전 살포 효과적" },
        { name: "다이센엠-45", primary: true, reason: "접촉성 살균, 넓은 병해 스펙트럼. 저항성 발현 낮음" },
        { name: "캡타폴",                    reason: "감염 초기 치료에 적합. 병반 확산 억제" },
        { name: "프로피네브",                reason: "예방 위주 살포용. 다른 계통과 교호 사용 권장" },
      ],
    },
  },
  {
    date: "2026.05.14", time: "09:22", state: "warn", label: "초기 병반 의심 · 64%",
    photo: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
    diagZone: {
      zone: "B-3", accuracy: 64, area: 4,
      photo: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=900&q=80",
      time: "09:22", treat: "관찰 후 판단",
      disease: "탄저병 의심", diseaseEn: "Anthracnose (suspected)", color: "#E9B44C",
      drugs: [
        { name: "안트라콜",  primary: true, reason: "의심 단계 예방 처리. 확산 전 조기 차단 효과" },
        { name: "프로피네브",              reason: "잎 표면 보호막 형성. 예방 살포용" },
      ],
    },
  },
  {
    date: "2026.05.12", time: "09:10", state: "safe", label: "이상 없음",
    photo: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80",
  },
  {
    date: "2026.05.10", time: "09:05", state: "safe", label: "이상 없음",
    photo: "https://images.unsplash.com/photo-1582254465498-6bc70419bdd2?w=400&q=80",
  },
];

function OverviewMap({
  treatedIds,
  onSelect,
}: {
  treatedIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative w-full h-[280px] rounded-[16px] overflow-hidden bg-gradient-to-br from-[#eef2ea] via-[#e3ead9] to-[#d4dfc5]">
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ovGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--brand-green)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ovGrid)" />
      </svg>

      <svg viewBox="0 0 360 280" className="absolute inset-0 w-full h-full">
        {PARCELS.map((p) => {
          const state: ParcelState = treatedIds.has(p.id) ? "safe" : p.state;
          const color = TONE[state].color;
          return (
            <g key={p.id} className="cursor-pointer" onClick={() => onSelect(p.id)}>
              <path
                d={p.d}
                fill={color}
                fillOpacity={0.4}
                stroke={color}
                strokeWidth={state === "danger" ? 2 : 1.5}
                strokeLinejoin="round"
              />
              <text
                x={p.labelX}
                y={p.labelY}
                fontSize={state === "danger" ? 13 : 11}
                fill={color}
                fontWeight={800}
                textAnchor="middle"
              >
                {p.id}
              </text>
              {state === "danger" && (
                <circle cx={p.labelX} cy={p.labelY + 14} r="4" fill={color}>
                  <animate attributeName="r" values="4;8;4" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.25;0.8" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute top-2.5 left-2.5 px-2.5 py-1.5 rounded-[10px] bg-white/80 backdrop-blur-md flex items-center gap-2.5">
        <Legend color="var(--brand-green)" label="안전" />
        <Legend color="#E9B44C" label="주의" />
        <Legend color="#CF4F0E" label="위험" />
      </div>
      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/80 backdrop-blur-md flex items-center gap-1">
        <Hand className="w-3 h-3 text-neutral-700" />
        <span className="text-[10px] text-neutral-700 tracking-tight">구역 선택</span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
      <span className="text-[10px] text-neutral-700">{label}</span>
    </div>
  );
}

function ZoomedMap({ parcel, state }: { parcel: Parcel; state: ParcelState }) {
  const color = TONE[state].color;
  return (
    <div className="relative w-full h-[170px] rounded-[16px] overflow-hidden bg-gradient-to-br from-[#eef2ea] via-[#e3ead9] to-[#d4dfc5]">
      <svg className="absolute inset-0 w-full h-full opacity-25">
        <defs>
          <pattern id="zmGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--brand-green)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zmGrid)" />
      </svg>
      <svg viewBox="0 0 360 170" className="absolute inset-0 w-full h-full">
        <path
          d="M40,30 L320,28 L325,138 L36,144 Z"
          fill={color}
          fillOpacity={0.4}
          stroke={color}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <text x="180" y="92" fontSize="22" fill={color} fontWeight="800" textAnchor="middle">
          {parcel.id}
        </text>
        {state === "danger" && (
          <circle cx="180" cy="108" r="9" fill={color}>
            <animate attributeName="r" values="9;15;9" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
      <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-white/85 backdrop-blur-md">
        <span className="text-[10px] text-neutral-700 tracking-tight">미니맵 · 확대</span>
      </div>
    </div>
  );
}

function DiagnosisHistorySection({ onOpenDiagSheet }: { onOpenDiagSheet: (z: DiagZone) => void }) {
  const { mockData } = useApp();
  return (
    <section className="mt-5 px-5">
      <div className="flex items-end justify-between mb-3 px-0.5">
        <h2 className="text-[18px] tracking-tight text-neutral-900" style={{ fontWeight: 700 }}>
          사진 진단 이력
        </h2>
        {mockData && <span className="text-[11.5px] text-neutral-400 tracking-tight">최근 → 과거</span>}
      </div>

      {!mockData ? (
        <EmptyDiagHistory />
      ) : (
        <div className="relative pl-5">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-200" />
          <div className="space-y-3">
            {HISTORY.map((h, idx) => {
              const t = TONE[h.state];
              return (
                <div key={idx} className="relative">
                  <span
                    className="absolute -left-5 top-3 w-3.5 h-3.5 rounded-full ring-[3px] ring-[#f5f5f3]"
                    style={{ background: t.color }}
                  />
                  <div className="rounded-[14px] bg-white p-2.5 flex gap-3">
                    <div className="w-[68px] h-[68px] rounded-[10px] flex-shrink-0 bg-neutral-200" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full text-white tracking-tight"
                          style={{ background: t.color, fontWeight: 600 }}
                        >
                          {t.label}
                        </span>
                        <span className="text-[11px] text-neutral-500 tracking-tight">{h.date}</span>
                        <span className="text-[11px] text-neutral-400 tracking-tight ml-auto">{h.time}</span>
                      </div>
                      <p className="mt-1 text-[13.5px] text-neutral-900 tracking-tight truncate" style={{ fontWeight: 600 }}>
                        {h.label}
                      </p>
                      {h.diagZone ? (
                        <button
                          onClick={() => onOpenDiagSheet(h.diagZone!)}
                          className="mt-0.5 text-[11.5px] tracking-tight inline-flex items-center"
                          style={{ color: "var(--brand-green)", fontWeight: 600 }}
                        >
                          사진 상세 보기 <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="mt-0.5 text-[11.5px] text-neutral-400 tracking-tight inline-flex items-center">
                          이상 없음
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function DetailView({
  parcel,
  treated,
  onTreat,
  onBack,
  onOpenDiagSheet,
}: {
  parcel: Parcel;
  treated: boolean;
  onTreat: () => void;
  onBack: () => void;
  onOpenDiagSheet: (zone: DiagZone) => void;
}) {
  const currentState: ParcelState = treated ? "safe" : parcel.state;
  const tone = TONE[currentState];

  return (
    <div className="pb-6">
      <div className="px-5 pt-1">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-0.5 -ml-1.5 h-9 pl-1.5 pr-3 rounded-full active:bg-neutral-200/60 transition-colors"
          style={{ color: "var(--brand-green)" }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[14px] tracking-tight" style={{ fontWeight: 600 }}>
            전체 필지
          </span>
        </button>
      </div>

      <div className="px-5 mt-1">
        <div className="rounded-[16px] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11.5px] text-neutral-500 tracking-tight">필지 #{parcel.id}</span>
              <p
                className="tracking-tight text-neutral-900"
                style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                {parcel.name}
              </p>
              <div
                className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: `${tone.color}18` }}
              >
                <span className="text-[12px]">{tone.emoji}</span>
                <span className="text-[11.5px] tracking-tight" style={{ color: tone.color, fontWeight: 700 }}>
                  {tone.label} {currentState !== "safe" && `· ${parcel.note}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 max-w-[180px]">
              <div className="rounded-[10px] bg-neutral-50 p-2">
                <div className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" style={{ color: "var(--brand-green)" }} />
                  <span className="text-[10px] text-neutral-500 tracking-tight">면적</span>
                </div>
                <p className="text-[13px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
                  {parcel.area}
                </p>
              </div>
              <div className="rounded-[10px] bg-neutral-50 p-2">
                <div className="flex items-center gap-1">
                  <Sprout className="w-3 h-3" style={{ color: "var(--brand-green)" }} />
                  <span className="text-[10px] text-neutral-500 tracking-tight">작물</span>
                </div>
                <p className="text-[13px] text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
                  {parcel.crop}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <ZoomedMap parcel={parcel} state={currentState} />
          </div>
        </div>
      </div>

      <div className="px-5 mt-3">
        {!treated ? (
          <button
            onClick={onTreat}
            disabled={parcel.state === "safe"}
            className="w-full h-[54px] rounded-[16px] text-white tracking-tight flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40"
            style={{ background: "var(--brand-green)", fontSize: 15.5, fontWeight: 700 }}
          >
            <Check className="w-[18px] h-[18px]" />
            방제 완료 처리
          </button>
        ) : (
          <div
            className="w-full h-[54px] rounded-[16px] flex items-center justify-center gap-2"
            style={{ background: "color-mix(in srgb, var(--brand-green) 12%, transparent)", color: "var(--brand-green)" }}
          >
            <CheckCircle2 className="w-[18px] h-[18px]" />
            <span className="text-[14px] tracking-tight" style={{ fontWeight: 700 }}>
              방제 완료됨 · 안전 상태로 초기화
            </span>
          </div>
        )}
        <p className="mt-1.5 text-center text-[11px] text-neutral-400 tracking-tight">
          처리 후 다음 예찰에서 재확인됩니다.
        </p>
      </div>

      <DiagnosisHistorySection onOpenDiagSheet={onOpenDiagSheet} />
    </div>
  );
}

type ParcelDetailsProps = {
  initialSelectedId?: string | null;
  onInitialConsumed?: () => void;
  onOpenDiagSheet: (zone: DiagZone) => void;
};

export function ParcelDetails({ initialSelectedId, onInitialConsumed, onOpenDiagSheet }: ParcelDetailsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
  const [treatedIds, setTreatedIds] = useState<Set<string>>(new Set());
  const { mockData } = useApp();

  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId);
      onInitialConsumed?.();
    }
  }, [initialSelectedId]);

  const parcel = selectedId ? PARCELS.find((p) => p.id === selectedId) ?? null : null;

  if (parcel) {
    const isTreated = treatedIds.has(parcel.id);
    return (
      <DetailView
        parcel={parcel}
        treated={isTreated}
        onTreat={() =>
          setTreatedIds((s) => {
            const n = new Set(s);
            n.add(parcel.id);
            return n;
          })
        }
        onBack={() => setSelectedId(null)}
        onOpenDiagSheet={onOpenDiagSheet}
      />
    );
  }

  if (!mockData) {
    return (
      <div className="pb-6 px-5 pt-4">
        <span className="text-[11.5px] text-neutral-500 tracking-tight">전체 필지</span>
        <p className="mt-0.5 tracking-tight text-neutral-900" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
          등록된 필지가 없어요
        </p>
        <div className="mt-4">
          <EmptyParcelList />
        </div>
      </div>
    );
  }

  const counts = {
    danger: PARCELS.filter((p) => !treatedIds.has(p.id) && p.state === "danger").length,
    warn: PARCELS.filter((p) => !treatedIds.has(p.id) && p.state === "warn").length,
    safe: PARCELS.length - PARCELS.filter((p) => !treatedIds.has(p.id) && p.state !== "safe").length,
  };

  return (
    <div className="pb-6">
      <div className="px-5 pt-2">
        <span className="text-[11.5px] text-neutral-500 tracking-tight">전체 필지 · 6 구역</span>
        <p
          className="tracking-tight text-neutral-900"
          style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          지도를 눌러 구역을 선택
        </p>
        <div className="mt-3">
          <OverviewMap treatedIds={treatedIds} onSelect={setSelectedId} />
        </div>
      </div>

      <div className="px-5 mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-[12px] bg-white p-2.5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#CF4F0E" }} />
            <span className="text-[10.5px] text-neutral-500 tracking-tight">위험</span>
          </div>
          <p
            className="tracking-tight"
            style={{ fontSize: 20, fontWeight: 700, color: "#CF4F0E", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            {counts.danger}
            <span className="text-[10px] text-neutral-400 ml-0.5" style={{ fontWeight: 500 }}>구역</span>
          </p>
        </div>
        <div className="rounded-[12px] bg-white p-2.5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#E9B44C" }} />
            <span className="text-[10.5px] text-neutral-500 tracking-tight">주의</span>
          </div>
          <p
            className="tracking-tight"
            style={{ fontSize: 20, fontWeight: 700, color: "#E9B44C", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            {counts.warn}
            <span className="text-[10px] text-neutral-400 ml-0.5" style={{ fontWeight: 500 }}>구역</span>
          </p>
        </div>
        <div className="rounded-[12px] bg-white p-2.5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-green)" }} />
            <span className="text-[10.5px] text-neutral-500 tracking-tight">안전</span>
          </div>
          <p
            className="tracking-tight"
            style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-green)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            {counts.safe}
            <span className="text-[10px] text-neutral-400 ml-0.5" style={{ fontWeight: 500 }}>구역</span>
          </p>
        </div>
      </div>

      <section className="mt-5 px-5">
        <div className="flex items-end justify-between mb-2 px-0.5">
          <span className="text-[11.5px] text-neutral-500 tracking-tight">구역 목록</span>
          <span className="text-[11.5px] text-neutral-400 tracking-tight">탭하여 상세 보기</span>
        </div>
        <div className="space-y-2">
          {PARCELS.map((p) => {
            const state: ParcelState = treatedIds.has(p.id) ? "safe" : p.state;
            const t = TONE[state];
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="w-full rounded-[14px] bg-white p-3 flex items-center gap-3 active:bg-neutral-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-[11px] flex items-center justify-center"
                  style={{ background: `${t.color}1A` }}
                >
                  <span className="text-[12.5px] tracking-tight" style={{ color: t.color, fontWeight: 800 }}>
                    {p.id}
                  </span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full text-white tracking-tight"
                      style={{ background: t.color, fontWeight: 600 }}
                    >
                      {t.label}
                    </span>
                    <span className="text-[11px] text-neutral-500 tracking-tight">{p.area} · {p.crop}</span>
                  </div>
                  <p className="mt-0.5 text-[13.5px] text-neutral-900 tracking-tight truncate" style={{ fontWeight: 600 }}>
                    {state === "safe" ? "안전" : p.note}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Pill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-[12px] bg-white p-2.5">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10.5px] text-neutral-500 tracking-tight">{label}</span>
      </div>
      <p
        className="tracking-tight"
        style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: "-0.03em", lineHeight: 1.1 }}
      >
        {value}
        <span className="text-[10px] text-neutral-400 ml-0.5" style={{ fontWeight: 500 }}>구역</span>
      </p>
    </div>
  );
}
