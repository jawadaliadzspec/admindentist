import { axiosInstance } from './axios';

export const usePut = (url: string, data: any) => {
  return axiosInstance.put(url, data);
};
