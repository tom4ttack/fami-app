import { useState } from "react";
import { ChevronDown, MapPin, Calendar, Sparkles, Camera } from "lucide-react";
import { DateSelector } from "../components/date-selector";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { DiagZone } from "../components/diagnosis-sheet";
import { EmptyDiagSummaryCard, EmptyDiagResultList } from "../components/empty-states";
import { useApp } from "../context";

type Disease = {
  name: string;
  en: string;
  count: number;
  tone: "danger" | "warn" | "safe";
  zones: DiagZone[];
};

const DATA: Disease[] = [
  {
    name: "탄저병",
    en: "Anthracnose",
    count: 3,
    tone: "danger",
    zones: [
      {
        zone: "B-3", accuracy: 92, area: 15,
        photo: "https://images.unsplash.com/photo-1518568403628-df55701ade9e?w=400&q=80",
        time: "09:38", treat: "1-2일 내 방제 권장",
        disease: "탄저병", diseaseEn: "Anthracnose", color: "#CF4F0E",
        drugs: [
          { name: "카브리오 에이(수화제)", primary: true, reason: "물 20L당 10g 희석하여 발병 초 10일 간격으로 살포. 장마철에는 7일 간격으로 살포" },
        ],
      },
      {
        zone: "B-4", accuracy: 78, area: 6,
        photo: "https://images.unsplash.com/photo-1582254465498-6bc70419bdd2?w=400&q=80",
        time: "09:12", treat: "3일 내 예방 살포",
        disease: "탄저병", diseaseEn: "Anthracnose", color: "#CF4F0E",
        drugs: [
          { name: "카브리오 에이(수화제)", primary: true, reason: "물 20L당 10g 희석하여 발병 초 10일 간격으로 살포. 장마철에는 7일 간격으로 살포" },
        ],
      },
      {
        zone: "C-1", accuracy: 65, area: 3,
        photo: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
        time: "08:47", treat: "관찰 후 판단",
        disease: "탄저병", diseaseEn: "Anthracnose", color: "#CF4F0E",
        drugs: [
          { name: "카브리오 에이(수화제)", primary: true, reason: "물 20L당 10g 희석하여 발병 초 10일 간격으로 살포. 장마철에는 7일 간격으로 살포" },
        ],
      },
    ],
  },
  {
    name: "무름병",
    en: "Soft Rot",
    count: 2,
    tone: "warn",
    zones: [
      {
        zone: "A-3", accuracy: 71, area: 4,
        photo: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80",
        time: "10:03", treat: "1주 내 방제 권장",
        disease: "무름병 (배추)", diseaseEn: "Soft Rot", color: "#E9B44C",
        drugs: [
          { name: "방범대(수화제)", primary: true, reason: "물 20L당 20g을 희석하여 발병 초기 10일 간격으로 살포. 수확 14일 전까지 3회 살포" },
        ],
      },
      {
        zone: "B-5", accuracy: 68, area: 3,
        photo: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
        time: "10:21", treat: "1주 내 방제 권장",
        disease: "무름병 (무)", diseaseEn: "Soft Rot", color: "#E9B44C",
        drugs: [
          { name: "아그리마이신(수화제)", primary: true, reason: "물 20L당 10g을 희석하여 발병 초기 7일 간격으로 살포" },
        ],
      },
    ],
  },
  {
    name: "정상 (이상 없음)",
    en: "Healthy",
    count: 8,
    tone: "safe",
    zones: [],
  },
];

const TONE: Record<Disease["tone"], { color: string; bg: string; label: string }> = {
  danger: { color: "#CF4F0E", bg: "rgba(207,79,14,0.10)",  label: "위험" },
  warn:   { color: "#E9B44C", bg: "rgba(233,180,76,0.12)", label: "주의" },
  safe:   { color: "var(--brand-green)", bg: "color-mix(in srgb, var(--brand-green) 10%, transparent)",  label: "정상" },
};

export function DiagnosisDashboard({ onOpenDiagSheet }: { onOpenDiagSheet: (zone: DiagZone) => void }) {
  const [open, setOpen] = useState<number | null>(0);
  const { mockData } = useApp();

  return (
    <div className="pb-6">
        <div className="px-5 pt-2">
          {mockData ? (
            <div className="rounded-[16px] bg-white p-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: "#E9B44C" }} />
                <span className="text-[11.5px] text-neutral-500 tracking-tight">사진 진단 분석 · 날짜별</span>
              </div>
              <p className="mt-1 tracking-tight text-neutral-900" style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>
                병해별 그룹 분석
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Mini label="총 진단" value="12" tone="var(--brand-green)" />
                <Mini label="병해 검출" value="4" tone="#CF4F0E" />
                <Mini label="정상" value="8" tone="var(--brand-green)" />
              </div>
            </div>
          ) : (
            <EmptyDiagSummaryCard />
          )}
        </div>

        <div className="mt-4">
          <DateSelector />
        </div>

        <section className="mt-5 px-5">
          <div className="flex items-end justify-between mb-3 px-0.5">
            <h2 className="text-[18px] tracking-tight text-neutral-900" style={{ fontWeight: 700 }}>
              병해별 진단 결과
            </h2>
            {mockData && <span className="text-[11.5px] text-neutral-400 tracking-tight">탭하여 펼치기</span>}
          </div>

          {!mockData ? (
            <EmptyDiagResultList />
          ) : (
          <div className="space-y-2.5">
            {DATA.map((d, i) => {
              const t = TONE[d.tone];
              const isOpen = open === i;
              return (
                <div key={d.name} className="rounded-[16px] bg-white overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-neutral-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-[11px] flex items-center justify-center" style={{ background: t.bg }}>
                      <Sparkles className="w-4 h-4" style={{ color: t.color }} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full text-white tracking-tight"
                          style={{ background: t.color, fontWeight: 600 }}
                        >
                          {t.label}
                        </span>
                        <span className="text-[11px] text-neutral-400 tracking-tight">{d.en}</span>
                      </div>
                      <p className="mt-0.5 text-[15px] tracking-tight text-neutral-900" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
                        {d.name}{" "}
                        <span className="text-[12.5px] text-neutral-500" style={{ fontWeight: 500 }}>총 {d.count}건</span>
                      </p>
                    </div>
                    <ChevronDown
                      className="w-4 h-4 text-neutral-400 transition-transform"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    />
                  </button>

                  {isOpen && d.zones.length > 0 && (
                    <div className="px-3 pb-3 space-y-2 border-t border-neutral-100 pt-3">
                      {d.zones.map((z) => (
                        <button
                          key={z.zone}
                          onClick={() => (d.tone === "danger" || d.tone === "warn") ? onOpenDiagSheet(z) : undefined}
                          className="w-full flex gap-3 rounded-[12px] bg-neutral-50 p-2.5 active:bg-neutral-100 transition-colors text-left"
                        >
                          <div className="w-16 h-16 rounded-[10px] flex-shrink-0 relative bg-neutral-200">
                            <span
                              className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full text-[9px] text-white"
                              style={{ background: t.color, fontWeight: 700 }}
                            >
                              {z.accuracy}%
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" style={{ color: t.color }} />
                              <span className="text-[12.5px] tracking-tight text-neutral-900" style={{ fontWeight: 700 }}>
                                {z.zone} 구역
                              </span>
                              <span className="text-[10.5px] text-neutral-400 tracking-tight ml-auto">{z.time}</span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-neutral-600 tracking-tight">
                              정확도 {z.accuracy}% · 피해면적 {z.area}%
                            </p>
                            <div
                              className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] tracking-tight"
                              style={{ background: t.bg, color: t.color, fontWeight: 600 }}
                            >
                              <Camera className="w-2.5 h-2.5" />
                              {z.treat}
                            </div>
                            {(d.tone === "danger" || d.tone === "warn") && (
                              <p className="mt-1 text-[10.5px] tracking-tight" style={{ color: t.color, fontWeight: 600 }}>
                                탭하여 상세 진단 보기 →
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {isOpen && d.zones.length === 0 && (
                    <div className="px-4 pb-3 pt-2 border-t border-neutral-100 text-[12px] text-neutral-500 tracking-tight">
                      이상이 발견되지 않은 정상 구역입니다.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}
        </section>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex-1 rounded-[12px] bg-neutral-50 p-2.5">
      <span className="text-[10.5px] text-neutral-500 tracking-tight">{label}</span>
      <p className="tracking-tight" style={{ fontSize: 20, fontWeight: 700, color: tone, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        {value}
        <span className="text-[10px] text-neutral-400 ml-0.5" style={{ fontWeight: 500 }}>건</span>
      </p>
    </div>
  );
}
