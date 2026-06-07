import { request } from "../client";
import type { ApiResponse, NotificationDto } from "../types";

export const notificationService = {
  /** 알림 목록 조회 */
  getAll(token: string): Promise<ApiResponse<NotificationDto[]>> {
    return request("/api/notifications", { token });
  },

  /** 알림 읽음 처리 */
  markRead(token: string, notificationId: number): Promise<ApiResponse<void>> {
    return request(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
      token,
    });
  },

  /** 전체 알림 읽음 처리 */
  markAllRead(token: string): Promise<ApiResponse<void>> {
    return request("/api/notifications/read-all", { method: "PATCH", token });
  },
};
