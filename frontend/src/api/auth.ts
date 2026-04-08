import axiosInstance from "./axios";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/login", data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/register", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/logout");
};

export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/me");
  return response.data;
};
