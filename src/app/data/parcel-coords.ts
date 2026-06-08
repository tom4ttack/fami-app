// WGS84 좌표 배열 — 실제 서비스에서는 백엔드 API에서 수신
// 백엔드 응답 형식: Record<string, { lat: number; lng: number }[]>

export type LatLng = { lat: number; lng: number };

export const MAP_CENTER: LatLng = { lat: 36.4576, lng: 126.8032 };

export const PARCEL_COORDS: Record<string, LatLng[]> = {
  "A-1": [
    { lat: 36.4590, lng: 126.8008 }, { lat: 36.4590, lng: 126.8023 },
    { lat: 36.4582, lng: 126.8023 }, { lat: 36.4582, lng: 126.8008 },
  ],
  "A-2": [
    { lat: 36.4590, lng: 126.8026 }, { lat: 36.4590, lng: 126.8041 },
    { lat: 36.4582, lng: 126.8041 }, { lat: 36.4582, lng: 126.8026 },
  ],
  "A-3": [
    { lat: 36.4590, lng: 126.8044 }, { lat: 36.4590, lng: 126.8055 },
    { lat: 36.4582, lng: 126.8055 }, { lat: 36.4582, lng: 126.8044 },
  ],
  "B-3": [
    { lat: 36.4580, lng: 126.8008 }, { lat: 36.4580, lng: 126.8023 },
    { lat: 36.4568, lng: 126.8023 }, { lat: 36.4568, lng: 126.8008 },
  ],
  "B-4": [
    { lat: 36.4580, lng: 126.8026 }, { lat: 36.4580, lng: 126.8041 },
    { lat: 36.4568, lng: 126.8041 }, { lat: 36.4568, lng: 126.8026 },
  ],
  "B-5": [
    { lat: 36.4580, lng: 126.8044 }, { lat: 36.4580, lng: 126.8055 },
    { lat: 36.4568, lng: 126.8055 }, { lat: 36.4568, lng: 126.8044 },
  ],
  "C-1": [
    { lat: 36.4566, lng: 126.8008 }, { lat: 36.4566, lng: 126.8023 },
    { lat: 36.4554, lng: 126.8023 }, { lat: 36.4554, lng: 126.8008 },
  ],
};

/** 검색 주소 중심점 기준으로 임시 필지 좌표 생성 (온보딩용) */
export function generateMockParcels(center: LatLng): Array<{ id: string; coords: LatLng[] }> {
  const D = 0.0013;
  const offsets: [number, number][] = [
    [D, -2.2 * D], [D, -0.5 * D], [D, 1.2 * D],
    [-0.2 * D, -2.2 * D], [-0.2 * D, -0.5 * D], [-0.2 * D, 1.2 * D],
  ];
  const ids = ["A-1", "A-2", "A-3", "B-3", "B-4", "B-5"];
  return ids.map((id, i) => {
    const [dlat, dlng] = offsets[i];
    return {
      id,
      coords: [
        { lat: center.lat + dlat,         lng: center.lng + dlng },
        { lat: center.lat + dlat,         lng: center.lng + dlng + D },
        { lat: center.lat + dlat - D * 0.6, lng: center.lng + dlng + D },
        { lat: center.lat + dlat - D * 0.6, lng: center.lng + dlng },
      ],
    };
  });
}
