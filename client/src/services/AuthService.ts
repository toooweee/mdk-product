import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse.ts";

export default class AuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>(
      "/auth/login",
      { email, password },
      { withCredentials: true },
    );
  }

  static async logout(): Promise<void> {
    return $api.post("/auth/logout", { withCredentials: true });
  }
}
