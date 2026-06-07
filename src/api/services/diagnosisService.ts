import { request } from "../client";
import type { ApiResponse, DiagnosisDto } from "../types";

export const diagnosisService = {
  /** 특정 필지의 진단 이력 조회 */
  getByParcel(token: string, parcelId: string): Promise<ApiResponse<DiagnosisDto[]>> {
    return request(`/api/parcels/${parcelId}/diagnoses`, { token });
  },

  /** 단일 진단 상세 조회 */
  getOne(token: string, diagnosisId: number): Promise<ApiResponse<DiagnosisDto>> {
    return request(`/api/diagnoses/${diagnosisId}`, { token });
  },

  /** 전체 진단 목록 조회 (진단 대시보드용) */
  getAll(token: string, params?: { date?: string; state?: string }): Promise<ApiResponse<DiagnosisDto[]>> {
    const query = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return request(`/api/diagnoses${query}`, { token });
  },

  /** AI 진단 수동 요청 (사진 업로드 후 presigned URL 방식) */
  requestAnalysis(token: string, parcelId: string, photoUrl: string): Promise<ApiResponse<DiagnosisDto>> {
    return request("/api/diagnoses/analyze", {
      method: "POST",
      body: { parcelId, photoUrl },
      token,
    });
  },
};
