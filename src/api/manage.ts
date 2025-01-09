import { useGet } from '~/packages/axios/src/use-get';

const fetchResourceList = async (resource: string, params: any = {}) => {
  const defaultParams = { page: 1, perPage: 10 };
  const queryParams = { ...defaultParams, ...params };
  return await useGet(`/${resource}`, { params: queryParams });
};

export const fetchGetUserList = async (params: any) => fetchResourceList('users', params);
export const fetchGetRoleList = async (params: any) => fetchResourceList('roles', params);
export const fetchGetMenuList = async (params: any) => fetchResourceList('menus', params);
export const fetchGetPermissionsList = async (params: any) => fetchResourceList('permissions', params);
