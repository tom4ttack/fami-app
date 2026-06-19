import { useState, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DateSelector() {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 1. 상단 타이틀용 현재 연.월 동적 생성 (예: 2026.06)
  const currentYearMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}.${month}`;
  }, []);

  // 2. 오늘 기준 과거 15일 전부터 오늘까지 총 16개의 날짜 오브젝트 동적 생성
  const ALL_DATES = useMemo(() => {
    const result = [];
    const now = new Date();

    for (let i = 15; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      
      const isToday = i === 0;
      result.push({
        d: `${targetDate.getMonth() + 1}.${targetDate.getDate()}`,
        w: isToday ? "오늘" : weekdays[targetDate.getDay()],
        today: isToday,
      });
    }
    return result;
  }, []);

  // 배열의 마지막 아이템인 '오늘'이 기본 선택되도록 지정
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
        {/* 하드코딩되었던 연.월이 동적으로 변환됩니다 */}
        <span className="text-[11px] text-neutral-400 tracking-tight">{currentYearMonth}</span>
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
                  {it.today && (
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