import { apiBaseUrl } from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 5000,
});
