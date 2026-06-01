import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ALL_DATES = [
  { d: "5.1", w: "금" },
  { d: "5.2", w: "토" },
  { d: "5.3", w: "일" },
  { d: "5.4", w: "월" },
  { d: "5.5", w: "화" },
  { d: "5.6", w: "수" },
  { d: "5.7", w: "목" },
  { d: "5.8", w: "금" },
  { d: "5.9", w: "토" },
  { d: "5.10", w: "일" },
  { d: "5.11", w: "월" },
  { d: "5.12", w: "화" },
  { d: "5.13", w: "수" },
  { d: "5.14", w: "목" },
  { d: "5.15", w: "금" },
  { d: "5.16", w: "오늘", today: true },
];

export function DateSelector() {
  const [active, setActive] = useState(ALL_DATES.length - 1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
    }
  };

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] text-neutral-500 tracking-tight">날짜별 변화 보기</span>
        <span className="text-[11px] text-neutral-400 tracking-tight">2026.05</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => scroll("left")}
          className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 active:bg-neutral-100 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-500" />
        </button>
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-2 pb-1">
            {ALL_DATES.map((it, i) => {
              const isActive = i === active;
              return (
                <button
                  key={it.d}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 w-[54px] h-[64px] rounded-[14px] flex flex-col items-center justify-center transition-all ${
                    isActive ? "" : "bg-white"
                  }`}
                  style={isActive ? { background: "#E9B44C" } : {}}
                >
                  <span
                    className={`text-[10px] tracking-tight ${isActive ? "text-white/90" : "text-neutral-500"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {it.w}
                  </span>
                  <span
                    className={`text-[15px] tracking-tight mt-0.5 ${isActive ? "text-white" : "text-neutral-900"}`}
                    style={{ fontWeight: 700 }}
                  >
                    {it.d}
                  </span>
                  {(it as { today?: boolean }).today && (
                    <span className={`mt-0.5 w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-[#E9B44C]"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => scroll("right")}
          className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 active:bg-neutral-100 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
        </button>
      </div>
    </div>
  );
}
