export function getServiceBaseURL(env: Env.ImportMeta) {
  const { VITE_SERVICE_BASE_URL } = env;

  const httpConfig: App.Service.ServiceConfigItem = {
    baseURL: VITE_SERVICE_BASE_URL
  };

  return {
    baseURL: httpConfig.baseURL
  };
}
