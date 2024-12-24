import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';
import { createAxiosConfig } from './utils';

const createAxios = (options = {}) => {
  const axiosConf = createAxiosConfig(options);
  const service: AxiosInstance = axios.create(axiosConf);
  setupInterceptors(service);
  return service;
};

export const axiosInstance = createAxios();
