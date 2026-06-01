import { useState } from "react";

const DATES = ["5/10", "5/12", "5/14", "오늘", "예측"];

export function TimelineControl() {
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
