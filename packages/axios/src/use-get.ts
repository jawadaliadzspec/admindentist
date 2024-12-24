import type { AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axios';

export const useGet = (url: string, params?: AxiosRequestConfig) => {
  return axiosInstance.get(url, params);
};
