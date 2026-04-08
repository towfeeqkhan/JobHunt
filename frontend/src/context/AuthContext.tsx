import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getProfile,
} from "../api/auth";
import type { User, LoginData, RegisterData } from "../api/auth";
import { setAccessToken, clearAccessToken } from "../api/axios";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["profile"], data.user);
      toast.success("Logged in successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Login failed"));
    },
  });

  const registerMutation = useMutation({
    mutationFn: apiRegister,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["profile"], data.user);
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Registration failed"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      clearAccessToken();
      queryClient.setQueryData(["profile"], null);
      queryClient.clear();
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Logout failed"));
    },
  });

  const login = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
