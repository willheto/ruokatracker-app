import { LoginInputs } from "@/app/(tabs)";
import { apiBaseUrl } from "@/config";
import { axiosInstance } from "../axiosInstance";

export async function login(data: LoginInputs) {
  const response = await axiosInstance.post(apiBaseUrl + "/user/login", data);
  return response.data;
}

export async function signUp(data: { email: string; password: string }) {
  const response = await axiosInstance.post(apiBaseUrl + "/user/signup", data);
  return response.data;
}

export async function authenticate(data: { token: string }) {
  const response = await axiosInstance.post(
    apiBaseUrl + "/user/authenticate",
    data
  );
  return response.data;
}
