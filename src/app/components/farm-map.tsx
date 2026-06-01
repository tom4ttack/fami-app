type Props = {
  onZoneClick?: () => void;
  onZoneSelect?: (zoneId: string) => void;
};

const ZONES = [
  { id: "A-1", d: "M22,24 L130,20 L138,80 L28,88 Z",    lx: 75,  ly: 58,  state: "safe"   },
  { id: "A-2", d: "M150,22 L256,30 L246,84 L142,80 Z",   lx: 195, ly: 58,  state: "safe"   },
  { id: "A-3", d: "M266,32 L340,42 L334,102 L258,90 Z",  lx: 295, ly: 68,  state: "safe"   },
  { id: "B-3", d: "M30,100 L142,94 L150,170 L38,178 Z",  lx: 88,  ly: 136, state: "danger" },
  { id: "B-4", d: "M160,94 L268,104 L260,176 L156,168 Z",lx: 208, ly: 138, state: "safe"   },
  { id: "B-5", d: "M278,114 L340,118 L334,182 L270,180 Z",lx:302, ly: 152, state: "safe"   },
];

const C = { safe: "var(--brand-green)", danger: "#CF4F0E" };
const LC = { safe: "#3a5235", danger: "#8a2500" };

export function FarmMap({ onZoneClick, onZoneSelect }: Props) {
  const handleZone = (id: string) => {
    if (onZoneSelect) onZoneSelect(id);
    else if (onZoneClick) onZoneClick();
  };

  return (
    <div className="relative w-full h-[270px] rounded-[16px] overflow-hidden bg-gradient-to-br from-[#eef2ea] via-[#e3ead9] to-[#d4dfc5] cursor-pointer">
      <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid2" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="var(--brand-green)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)" />
      </svg>

      <svg viewBox="0 0 360 200" className="absolute inset-0 w-full h-full">
        {ZONES.map((z) => {
          const c = C[z.state as keyof typeof C];
          const lc = LC[z.state as keyof typeof LC];
          const isDanger = z.state === "danger";
          return (
            <g key={z.id} className="cursor-pointer" onClick={() => handleZone(z.id)}>
              <path
                d={z.d}
                fill={c}
                fillOpacity={0.4}
                stroke={c}
                strokeWidth={isDanger ? 1.8 : 1.5}
                strokeLinejoin="round"
              />
              <text
                x={z.lx} y={z.ly}
                fontSize={isDanger ? 11 : 9}
                fill={lc}
                fontWeight={800}
                textAnchor="middle"
              >
                {z.id}
              </text>
              {isDanger && (
                <>
                  <circle cx={z.lx} cy={z.ly + 12} r="5" fill={c}>
                    <animate attributeName="r" values="5;9;5" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={z.lx} cy={z.ly + 12} r="3" fill={c} />
                </>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute top-2.5 left-2.5 px-2.5 py-1.5 rounded-[10px] bg-white/75 backdrop-blur-md flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm" style={{ background: "var(--brand-green)" }} />
          <span className="text-[10px] text-neutral-700">안전</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm" style={{ background: "#E9B44C" }} />
          <span className="text-[10px] text-neutral-700">주의</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm" style={{ background: "#CF4F0E" }} />
          <span className="text-[10px] text-neutral-700">위험</span>
        </div>
      </div>
      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/75 backdrop-blur-md">
        <span className="text-[10px] text-neutral-700 tracking-tight">팜맵 · 6 필지</span>
      </div>
    </div>
  );
}
