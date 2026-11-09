import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../config/api.config";

export interface LoginApiRequest {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  salon_id: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginApiRequest): Promise<LoginApiResponse> {
    const response = await apiClient.post<LoginApiResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },
};

export default authService;

