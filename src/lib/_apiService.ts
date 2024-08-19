// lib/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getApiUrl } from "@/utils/ApiHelper";

const api = axios.create({
  baseURL: getApiUrl(),
});

api.interceptors.request.use((config: { headers: any }) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export const get = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
};

export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
) => {
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
};

export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
) => {
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
};

export const deleteRequest = async <T>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const response: AxiosResponse<T> = await api.delete(url, config);
  return response.data;
};
