// ── 공통 ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ── 사용자 ─────────────────────────────────────────────
export interface UserDto {
  id: number;
  name: string;
  phone: string;
  region: string;
  notificationRadius: number;
}

// ── 필지 ──────────────────────────────────────────────
export type ParcelState = "danger" | "warn" | "safe";

export interface ParcelDto {
  id: string;
  name: string;
  area: string;
  crop: string;
  state: ParcelState;
  note: string;
}

// ── 진단 ──────────────────────────────────────────────
export interface DrugDto {
  name: string;
  primary: boolean;
  reason: string;
}

export interface DiagnosisDto {
  id: number;
  parcelId: string;
  date: string;       // "2026-05-16"
  time: string;       // "09:38"
  disease: string;
  diseaseEn: string;
  accuracy: number;
  affectedArea: number;
  treatmentGuide: string;
  color: string;
  photoUrl: string;
  drugs: DrugDto[];
}

// ── 알림 ──────────────────────────────────────────────
export type NotificationSeverity = "danger" | "warn" | "info";

export interface NotificationDto {
  id: number;
  parcelId: string;
  title: string;
  body: string;
  severity: NotificationSeverity;
  read: boolean;
  createdAt: string;  // ISO 8601
}
