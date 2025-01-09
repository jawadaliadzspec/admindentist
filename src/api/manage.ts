import { useGet } from '~/packages/axios/src/use-get';

const fetchResourceList = async (resource: string, params: any = {}) => {
  const defaultParams = { page: 1, perPage: 10 };
  const queryParams = { ...defaultParams, ...params };
  return await useGet(`/${resource}`, { params: queryParams });
};

export const fetchUserList = async (params: any) => fetchResourceList('users', params);
export const fetchRoleList = async (params: any) => fetchResourceList('roles', params);
export const fetchMenuList = async (params: any) => fetchResourceList('menus', params);
export const fetchPermissionsList = async (params: any) => fetchResourceList('permissions', params);
