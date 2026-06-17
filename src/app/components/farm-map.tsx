import { useEffect, useState } from "react";
import { KakaoMap, ParcelPolygon } from "./kakao-map";
// 🎯 [수정] 가짜 데이터 파일 대신, 진짜 백엔드 서버와 통신하는 mapService를 불러옵니다.
import { mapService } from "../../api/services/mapService";

type Props = {
  pnu?: string; // 👈 관제할 고추밭의 PNU 번호를 외부에서 받아올 수 있도록 추가
  onZoneClick?: () => void;
  onZoneSelect?: (zoneId: string) => void;
};

export function FarmMap({ pnu = "4479025025103890002", onZoneClick, onZoneSelect }: Props) {
  // 🎯 [수정] 서버에서 받아올 진짜 팜맵 좌표 데이터를 저장할 공간
  const [parcels, setParcels] = useState<ParcelPolygon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 📡 [수정] 페이지가 켜지면 서버 엔드포인트(/api/map/parcel)를 찔러 데이터를 수신합니다.
  useEffect(() => {
    setLoading(true);
    mapService.getCoordinatesByPnu(pnu)
      .then((res: any) => {
        if (res.data && res.data.coordinates) {
          // 백엔드가 변환해서 던져준 예쁜 위도·경도 배열을 카카오맵 규격에 맞게 연동
          setParcels([
            {
              id: res.data.pnu || pnu,
              label: "내 고추밭",
              coordinates: res.data.coordinates, 
              state: "safe", // 기본 상태는 안전으로 세팅
            }
          ]);
        }
      })
      .catch((err: any) => console.error("서버에서 지도 데이터를 가져오는데 실패했습니다:", err))
      .finally(() => setLoading(false));
  }, [pnu]);

  const handleClick = (id: string) => {
    if (onZoneSelect) onZoneSelect(id);
    else if (onZoneClick) onZoneClick();
  };

  // ⏳ [수정] 데이터를 불러오는 동안 화면이 굳지 않고 로딩 창이 뜨도록 방어
  if (loading) {
    return (
      <div className="w-full h-[270px] rounded-[16px] bg-neutral-100 flex items-center justify-center">
        <span className="text-xs text-neutral-500">서버에서 고추밭 좌표 수신 중...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[270px] rounded-[16px] overflow-hidden">
      {/* 🎯 가짜 변수 대신 서버에서 실시간으로 수신한 진짜 parcels 데이터를 주입합니다. */}
      <KakaoMap parcels={parcels} level={3} onParcelClick={handleClick} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-[10px] bg-white/85 backdrop-blur-md flex items-center gap-2.5 pointer-events-none">
        <LegendItem color="var(--brand-green)" label="안전" />
        <LegendItem color="#E9B44C" label="주의" />
        <LegendItem color="#CF4F0E" label="위험" />
      </div>

      {/* Chip */}
      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/85 backdrop-blur-md flex items-center pointer-events-none">
        <span className="text-[10px] text-neutral-700 tracking-tight leading-none">실시간 DB 연동 완료</span>
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