import { IRefreshToken } from "../IRefreshToken.ts";
import { IUser } from "../IUser.ts";

export interface AuthResponse {
  accessToken: string;
  refreshToken: IRefreshToken;
  user: IUser;
}
