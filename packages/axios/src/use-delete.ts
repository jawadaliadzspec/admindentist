import { axiosInstance } from './axios';

export const useDelete = (url: string, params: any) => {
  return axiosInstance.delete(url, { params });
};
