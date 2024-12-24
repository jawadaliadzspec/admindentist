import { axiosInstance } from './axios';

export const usePatch = (url: string, data: any) => {
  return axiosInstance.patch(url, data);
};
