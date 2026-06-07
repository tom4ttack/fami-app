import { request } from "../client";
import type { ApiResponse, ParcelDto } from "../types";

export const parcelService = {
  /** 내 필지 목록 조회 */
  getAll(token: string): Promise<ApiResponse<ParcelDto[]>> {
    return request("/api/parcels", { token });
  },

  /** 단일 필지 조회 */
  getOne(token: string, parcelId: string): Promise<ApiResponse<ParcelDto>> {
    return request(`/api/parcels/${parcelId}`, { token });
  },

  /** 필지 등록 */
  create(token: string, data: Omit<ParcelDto, "state" | "note">[]): Promise<ApiResponse<ParcelDto[]>> {
    return request("/api/parcels", { method: "POST", body: data, token });
  },

  /** 필지 작물 수정 */
  updateCrop(token: string, parcelId: string, crop: string): Promise<ApiResponse<ParcelDto>> {
    return request(`/api/parcels/${parcelId}/crop`, {
      method: "PATCH",
      body: { crop },
      token,
    });
  },

  /** 필지 삭제 */
  remove(token: string, parcelId: string): Promise<ApiResponse<void>> {
    return request(`/api/parcels/${parcelId}`, { method: "DELETE", token });
  },
};
