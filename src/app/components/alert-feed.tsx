import { MapPin, Camera, CheckCircle2, ChevronRight } from "lucide-react";

type Item = {
  zone: string;
  title: string;
  time: string;
  level: "danger" | "safe";
};

const ITEMS: Item[] = [
  { zone: "B-3", title: "탄저병 진단", time: "방금 전", level: "danger" },
  { zone: "A-2", title: "정상", time: "8분 전", level: "safe" },
  { zone: "A-1", title: "정상", time: "23분 전", level: "safe" },
];

type Props = { onViewPhoto: () => void };

export function AlertFeed({ onViewPhoto }: Props) {
  return (
    <section className="mt-5 px-5">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-[11.5px] text-neutral-500 tracking-tight">최근 알림</span>
        <button className="text-[11.5px] tracking-tight" style={{ color: "var(--brand-green)", fontWeight: 600 }}>
          전체
        </button>
      </div>

      <div className="space-y-2.5">
        {ITEMS.map((it, idx) => {
          const isDanger = it.level === "danger";
          const accent = isDanger ? "#CF4F0E" : "var(--brand-green)";
          return (
            <div
              key={idx}
              className="relative rounded-[16px] bg-white overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
              <div className="pl-4 pr-3 py-3 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                  style={{
                    background: isDanger ? "rgba(207,79,14,0.12)" : "color-mix(in srgb, var(--brand-green) 12%, transparent)",
                  }}
                >
                  {isDanger ? (
                    <Camera className="w-4 h-4" style={{ color: accent }} />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" style={{ color: accent }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full text-white tracking-tight"
                      style={{ background: accent, fontWeight: 600 }}
                    >
                      {isDanger ? "병해 확인" : "정상"}
                    </span>
                    <span className="text-[11px] text-neutral-500 tracking-tight">{it.zone} 구역</span>
                    <span className="text-[11px] text-neutral-400 tracking-tight ml-auto">{it.time}</span>
                  </div>
                  <p
                    className="text-[13.5px] text-neutral-900 tracking-tight truncate"
                    style={{ fontWeight: 500 }}
                  >
                    {it.title}
                  </p>
                </div>
                {!isDanger && <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />}
              </div>

              {isDanger && (
                <div className="px-3 pb-3 pt-0.5 flex gap-2">
                  <button
                    className="flex-1 h-9 rounded-[11px] bg-neutral-100 active:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 text-[13px] text-neutral-800 tracking-tight"
                    style={{ fontWeight: 500 }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    위치 확인
                  </button>
                  <button
                    onClick={onViewPhoto}
                    className="flex-1 h-9 rounded-[11px] flex items-center justify-center gap-1.5 text-[13px] text-white tracking-tight active:scale-[0.98] transition-transform"
                    style={{ background: accent, fontWeight: 500 }}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    사진 보기
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
