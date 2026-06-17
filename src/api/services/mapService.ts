import { request } from "../client";
import type { ApiResponse } from "../types";

export type LatLng = { lat: number; lng: number };

export type PnuParcelData = {
  id: string;        // 서버 생성 필지 식별자
  pnu: string;
  address: string;
  area: string;      // ㎡
  coordinates: LatLng[];
  center: LatLng;
};

// ── PNU 기반 좌표 조회 ─────────────────────────────────────────────────────
// GET /api/map/parcel?pnu={pnu}
// AWS MySQL에서 PNU에 해당하는 폴리곤 좌표 반환
export const mapService = {
  getCoordinatesByPnu(pnu: string, token?: string): Promise<ApiResponse<PnuParcelData>> {
    return request(`/api/map/parcel?pnu=${encodeURIComponent(pnu)}`, { token });
  },

  // PNU 배열을 한 번에 조회 (온보딩 다중 필지용)
  getCoordinatesByPnuBatch(
    pnus: string[],
    token?: string,
  ): Promise<ApiResponse<PnuParcelData[]>> {
    return request("/api/map/parcel/batch", {
      method: "POST",
      body: { pnus },
      token,
    });
  },

  // 주소 검색 → 팜맵 연동으로 필지 목록 반환
  searchParcelsByAddress(
    address: string,
    token?: string,
  ): Promise<ApiResponse<PnuParcelData[]>> {
    return request("/api/map/parcel/search", {
      method: "POST",
      body: { address },
      token,
    });
  },

  getParcelCoordinates(
    token: string,
    parcelIds?: string[],
  ): Promise<ApiResponse<Record<string, LatLng[]>>> {
    const query = parcelIds?.length
      ? "?" + parcelIds.map((id) => `ids=${encodeURIComponent(id)}`).join("&")
      : "";
    return request(`/api/map/parcels/coordinates${query}`, { token });
  },
};

// ── 개발용 Mock 응답 ──────────────────────────────────────────────────────
// 백엔드 미연결 시 PNU → 임시 좌표 반환
// 실 서버 연결 후 이 함수는 사용되지 않음
const MOCK_PNU_COORDS: Record<string, PnuParcelData> = {
  "4479025025103890002": {
    id: "P-001",
    pnu: "4479025025103890002",
    address: "충청남도 청양군 청양읍 적누리",
    area: "356",
    coordinates: [
      { lat: 36.4578, lng: 126.8015 },
      { lat: 36.4578, lng: 126.8029 },
      { lat: 36.4568, lng: 126.8029 },
      { lat: 36.4568, lng: 126.8015 },
    ],
    center: { lat: 36.4573, lng: 126.8022 },
  },
};

export function getMockPnuData(pnu: string): PnuParcelData | null {
  return MOCK_PNU_COORDS[pnu] ?? null;
}
