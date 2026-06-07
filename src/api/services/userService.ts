import { request } from "../client";
import type { ApiResponse, UserDto } from "../types";

export const userService = {
  /** 사용자 정보 조회 */
  getMe(token: string): Promise<ApiResponse<UserDto>> {
    return request("/api/users/me", { token });
  },

  /** 사용자 정보 수정 */
  updateMe(token: string, data: Partial<UserDto>): Promise<ApiResponse<UserDto>> {
    return request("/api/users/me", { method: "PUT", body: data, token });
  },

  /** 알림 반경 업데이트 */
  updateNotificationRadius(token: string, radius: number): Promise<ApiResponse<UserDto>> {
    return request("/api/users/me/notification-radius", {
      method: "PATCH",
      body: { radius },
      token,
    });
  },
};
