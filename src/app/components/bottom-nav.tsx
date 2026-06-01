import { Home, Map, LayoutDashboard } from "lucide-react";
import { useApp } from "../context";

const TABS = [
  { id: "home", label: "홈", Icon: Home },
  { id: "parcel", label: "필지 상세", Icon: Map },
  { id: "diag", label: "진단 대시보드", Icon: LayoutDashboard },
];

type Props = { active: string; onChange: (id: string) => void };

export function BottomNav({ active, onChange }: Props) {
  const { dark } = useApp();
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl">
      <div className="grid grid-cols-3 px-2 pt-2 pb-5">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          const color = isActive ? "#E9B44C" : dark ? "#c0c0be" : "#8a8a8a";
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-0.5 py-1 active:scale-95 transition-transform"
            >
              <Icon className="w-5 h-5" style={{ color }} strokeWidth={isActive ? 2.4 : 2} />
              <span
                className="text-[10.5px] tracking-tight"
                style={{ color, fontWeight: isActive ? 700 : 500 }}
              >
                {label}
              </span>
              {isActive && (
                <span className="mt-0.5 w-1 h-1 rounded-full" style={{ background: "#E9B44C" }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
