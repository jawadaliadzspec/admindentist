import type { CreateAxiosDefaults } from 'axios';

export const isHttpSuccess = (status: number) => {
  const isSuccessCode = status >= 200 && status < 300;
  return isSuccessCode || status === 304;
};

const { VITE_API_URL: apiUrl, VITE_API_PREFIX: apiPrefix } = import.meta.env;

export const createAxiosConfig = (config?: Partial<CreateAxiosDefaults>) => {
  const TEN_SECONDS = 10 * 1000;
  const axiosConfig: CreateAxiosDefaults = {
    baseURL: apiUrl! + apiPrefix,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: TEN_SECONDS,
    validateStatus: isHttpSuccess,
    withCredentials: true
  };

  Object.assign(axiosConfig, config);

  return axiosConfig;
};
