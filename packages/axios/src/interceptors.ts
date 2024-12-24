import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@awal/storage';
import { router } from '../../../src/router';
import { ACCESS_TOKEN } from './constants/auth';

const requestResolve = (req: InternalAxiosRequestConfig) => {
  const { url } = req;
  if (storage.isAuthenticated(ACCESS_TOKEN) && url) {
    req.headers.Authorization = storage.getAuthorization(ACCESS_TOKEN);
  }
  return req;
};

const requestReject = (err: AxiosError) => {
  return Promise.reject(err);
};

const responseResolve = (res: AxiosResponse) => res.data;

const responseReject = (err: AxiosError) => {
  const status = err.response?.status;
  const message: string = JSON.stringify(err.response?.data);

  if (status && status >= 400 && status < 500) {
    window.$message?.error(message);
  }

  if (status && status >= 500 && status < 600) {
    window.$message?.error(message);
  }

  if (!window.navigator.onLine) {
    window.$message?.error('Network Error');
    router.replace('/404');
  }
  return Promise.reject(err.response?.data || err);
};

export function setupInterceptors(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(requestResolve, requestReject);
  axiosInstance.interceptors.response.use(responseResolve, responseReject);
}
