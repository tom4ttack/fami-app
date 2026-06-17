import { request } from "../client";
import type { ApiResponse } from "../types";

export type LatLng = { lat: number; lng: number };

// 🎯 [수정] 백엔드 MySQL(coordinates_wgs) 응답 규격에 맞게 타입 최적화
export type PnuParcelData = {
  pnu: string;
  coordinates: LatLng[]; // 백엔드가 coordinates_wgs를 읽어서 이 키값으로 보내줍니다.
  id?: string;           // 에러 방지용 선택적 필드 처리
  address?: string;      
  area?: string;         
  center?: LatLng;       
};

// ── PNU 기반 좌표 조회 ─────────────────────────────────────────────────────
export const mapService = {
  // 🎯 백엔드 서버의 /api/map/parcel?pnu=... 주소로 진짜 데이터를 요청하는 함수
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
// 🎯 [수정] 바뀐 타입에 맞춰 껍데기 구조 매칭
const MOCK_PNU_COORDS: Record<string, PnuParcelData> = {
  "4479025025103890002": {
    pnu: "4479025025103890002",
    coordinates: [
      { lat: 36.4578, lng: 126.8015 },
      { lat: 36.4578, lng: 126.8029 },
      { lat: 36.4568, lng: 126.8029 },
      { lat: 36.4568, lng: 126.8015 },
    ],
  },
};

export function getMockPnuData(pnu: string): PnuParcelData | null {
  return MOCK_PNU_COORDS[pnu] ?? null;
}