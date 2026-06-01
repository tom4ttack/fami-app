import { X, Sparkles, Crop } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export type DiagZone = {
  zone: string;
  accuracy: number;
  area: number;
  photo: string;
  time: string;
  treat: string;
  disease: string;
  diseaseEn: string;
  color: string;
  drugs: { name: string; primary?: boolean; reason: string }[];
};

const DEFAULT_ZONE: DiagZone = {
  zone: "B-3",
  accuracy: 92,
  area: 15,
  photo: "https://images.unsplash.com/photo-1518568403628-df55701ade9e?w=900&q=80",
  time: "09:38",
  treat: "1-2일 내 방제 권장",
  disease: "탄저병",
  diseaseEn: "Anthracnose",
  color: "#CF4F0E",
  drugs: [
    { name: "안트라콜", primary: true,  reason: "탄저병 전문 예방·치료제. 잔류효과 길고 우천 전 살포 효과적" },
    { name: "다이센엠-45", primary: true, reason: "접촉성 살균, 넓은 병해 스펙트럼. 저항성 발현 낮음" },
    { name: "캡타폴",    reason: "감염 초기 치료에 적합. 병반 확산 억제" },
    { name: "프로피네브", reason: "예방 위주 살포용. 다른 계통과 교호 사용 권장" },
  ],
};

type Props = { open: boolean; onClose: () => void; zone?: DiagZone };

export function DiagnosisSheet({ open, onClose, zone = DEFAULT_ZONE }: Props) {
  const bgAccent = `${zone.color}18`;

  return (
    <>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 right-0 bottom-0 rounded-t-[22px] bg-white transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "86%" }}
      >
        <div className="pt-2.5 pb-1 flex justify-center">
          <span className="w-9 h-1 rounded-full bg-neutral-300" />
        </div>

        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500 tracking-tight">{zone.zone} 구역 · AI 사진 진단</span>
            <h3 className="text-[19px] tracking-tight text-neutral-900" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              진단 상세
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 active:bg-neutral-200 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        <div className="px-5 pb-5 overflow-y-auto" style={{ height: "calc(100% - 76px)" }}>
          {/* Photo */}
          <div className="relative rounded-[16px] overflow-hidden aspect-[16/10] bg-neutral-200">
            <svg viewBox="0 0 400 250" className="absolute inset-0 w-full h-full pointer-events-none">
              <circle cx="135" cy="120" r="28" fill={zone.color} fillOpacity="0.35" stroke={zone.color} strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="240" cy="170" r="22" fill={zone.color} fillOpacity="0.35" stroke={zone.color} strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center">
              <span className="text-[10px] text-neutral-700 tracking-tight text-center">2026.05.16 {zone.time}</span>
            </div>
            <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full text-white flex items-center justify-center" style={{ background: zone.color }}>
              <span className="text-[10px] tracking-tight text-center" style={{ fontWeight: 700 }}>병해 검출</span>
            </div>
            <div className="absolute bottom-2.5 right-2.5 w-16 h-12 rounded-[10px] bg-neutral-300 overflow-hidden">
            </div>
          </div>

          {/* Name */}
          <div className="mt-4">
            <span className="text-[11px] text-neutral-500 tracking-tight">진단명</span>
            <p className="text-[22px] tracking-tight" style={{ color: zone.color, fontWeight: 700, letterSpacing: "-0.02em" }}>
              {zone.disease}{" "}
              <span className="text-[14px] text-neutral-500" style={{ fontWeight: 500 }}>{zone.diseaseEn}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-[14px] bg-neutral-50 p-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#E9B44C" }} />
                <span className="text-[11px] text-neutral-500 tracking-tight">AI 정확도</span>
              </div>
              <p className="mt-1.5 tracking-tight" style={{ fontSize: 26, fontWeight: 700, color: zone.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {zone.accuracy}<span className="text-[14px] text-neutral-400" style={{ fontWeight: 500 }}>%</span>
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${zone.accuracy}%`, background: zone.color }} />
              </div>
            </div>
            <div className="rounded-[14px] bg-neutral-50 p-3">
              <div className="flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5" style={{ color: "var(--brand-green)" }} />
                <span className="text-[11px] text-neutral-500 tracking-tight">피해 면적</span>
              </div>
              <p className="mt-1.5 tracking-tight" style={{ fontSize: 26, fontWeight: 700, color: "var(--brand-green)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {zone.area}<span className="text-[14px] text-neutral-400" style={{ fontWeight: 500 }}>%</span>
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${zone.area}%`, background: "var(--brand-green)" }} />
              </div>
            </div>
          </div>

          {/* 방제 팁 */}
          <div
            className="mt-3 rounded-[14px] p-3.5"
            style={{ background: "rgba(233,180,76,0.10)" }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">💡</span>
              <span className="text-[11.5px] tracking-tight" style={{ color: "#8a6620", fontWeight: 700 }}>방제 팁</span>
            </div>
            <p className="mt-1.5 text-[13px] text-neutral-800 tracking-tight" style={{ fontWeight: 500, lineHeight: 1.45 }}>
              {zone.treat} — 비가 오기 전{" "}
              <span style={{ color: zone.color, fontWeight: 700 }}>예방 살포</span>가 중요합니다. 감염잎은 즉시 제거하고 통풍을 확보하세요.
            </p>
          </div>

          {/* 추천 농약 + 이유 */}
          <div className="mt-3 rounded-[14px] bg-white p-3.5">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-base leading-none">💊</span>
              <span className="text-[11.5px] text-neutral-700 tracking-tight" style={{ fontWeight: 700 }}>추천 농약</span>
            </div>
            <div className="space-y-2.5">
              {zone.drugs.map((d) => (
                <div key={d.name} className="flex gap-3 items-start">
                  <span
                    className="flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[11px] tracking-tight"
                    style={
                      d.primary
                        ? { background: "var(--brand-green)", color: "#fff", fontWeight: 600 }
                        : { background: "#f0f0ee", color: "#555", fontWeight: 500 }
                    }
                  >
                    {d.name}
                  </span>
                  <p className="text-[11.5px] text-neutral-600 tracking-tight" style={{ lineHeight: 1.5 }}>
                    {d.reason}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10.5px] text-neutral-400 tracking-tight">
              * 안전사용기준 및 농약 등록 현황을 반드시 확인하세요.
            </p>
          </div>

          <div className="h-4" />
        </div>
      </div>
    </>
  );
}
