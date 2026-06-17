import { KakaoMap, ParcelPolygon } from "./kakao-map";
import { PARCEL_COORDS } from "../data/parcel-coords";

type Props = {
  onZoneClick?: () => void;
  onZoneSelect?: (zoneId: string) => void;
};

const ZONE_STATES: Record<string, "danger" | "warn" | "safe"> = {
  "A-1": "safe",
  "A-2": "safe",
  "A-3": "warn",
  "B-3": "danger",
  "B-4": "danger",
  "B-5": "safe",
};

export function FarmMap({ onZoneClick, onZoneSelect }: Props) {
  const parcels: ParcelPolygon[] = Object.entries(PARCEL_COORDS)
    .filter(([id]) => id !== "C-1")
    .map(([id, coords]) => ({
      id,
      label: id,
      coordinates: coords,
      state: ZONE_STATES[id] ?? "safe",
    }));

  const handleClick = (id: string) => {
    if (onZoneSelect) onZoneSelect(id);
    else if (onZoneClick) onZoneClick();
  };

  return (
    <div className="relative w-full h-[270px] rounded-[16px] overflow-hidden">
      <KakaoMap parcels={parcels} level={4} onParcelClick={handleClick} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-[10px] bg-white/85 backdrop-blur-md flex items-center gap-2.5 pointer-events-none">
        <LegendItem color="var(--brand-green)" label="안전" />
        <LegendItem color="#E9B44C" label="주의" />
        <LegendItem color="#CF4F0E" label="위험" />
      </div>

      {/* Chip */}
      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/85 backdrop-blur-md flex items-center pointer-events-none">
        <span className="text-[10px] text-neutral-700 tracking-tight leading-none">팜맵 · 6 필지</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
      <span className="text-[10px] text-neutral-700">{label}</span>
    </div>
  );
}
