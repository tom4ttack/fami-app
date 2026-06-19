import { useState, useMemo } from "react";

export function TimelineControl() {
  // 오늘 기준으로 2일 간격의 과거 날짜들을 동적 생성
  const DATES = useMemo(() => {
    const now = new Date();
    const format = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    
    const d6 = new Date(); d6.setDate(now.getDate() - 6);
    const d4 = new Date(); d4.setDate(now.getDate() - 4);
    const d2 = new Date(); d2.setDate(now.getDate() - 2);

    return [format(d6), format(d4), format(d2), "오늘", "예측"];
  }, []);

  // 인덱스 3번인 '오늘'을 기본 활성화 상태로 설정
  const [active, setActive] = useState(3);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[13px] text-neutral-500 tracking-tight">날짜별 변화 보기</span>
        <span className="text-[12px] text-neutral-400 tracking-tight">Time-lapse</span>
      </div>
      <div className="p-1 rounded-[12px] bg-neutral-200/60 backdrop-blur flex">
        {DATES.map((d, i) => {
          const isActive = i === active;
          return (
            <button
              key={d}
              onClick={() => setActive(i)}
              className={`flex-1 py-1.5 rounded-[9px] text-[12px] tracking-tight transition-all ${
                isActive
                  ? "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.05)]"
                  : "text-neutral-600"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}