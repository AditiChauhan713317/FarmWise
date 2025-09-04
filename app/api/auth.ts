
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "./client";

// ---------- Types ----------
export interface RegisterPayload {
  name: string;
  mobile: string;
  preferredLanguage: string;
  location: string;
  password: string;
}

export interface LoginPayload {
  mobile: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  mobile: string;
  preferredLanguage: string;
  location: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// ---------- Functions ----------

// Register a new user
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const res: AuthResponse = await apiFetch("api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.data?.token) {
    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res;
};

// Login existing user
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res: AuthResponse = await apiFetch("api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.data?.token) {
    await AsyncStorage.setItem("token", res.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res;
};

// Logout user (clear storage)
export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

// Get stored user
export const getStoredUser = async (): Promise<User | null> => {
  const userStr = await AsyncStorage.getItem("user");
  return userStr ? (JSON.parse(userStr) as User) : null;
};

// Get stored token
export const getToken = async (): Promise<string | null> => {
  
  const token = await AsyncStorage.getItem("token");
  // console.log("Retrieved token:", token);
  return token;
};
