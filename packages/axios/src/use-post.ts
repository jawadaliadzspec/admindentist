import { axiosInstance } from './axios';

export const usePost = (url: string, data: any) => {
  return axiosInstance.post(url, data);
};
