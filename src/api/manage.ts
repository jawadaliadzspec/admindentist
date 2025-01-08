// import { useGet } from '@awal/axios';
import { useGet } from '~/packages/axios/src/use-get';
export const fetchGetUserList = async (params: any) => {
  return await useGet('/users', { params: { page: params.page ?? 1, perPage: params.perPage ?? 10 } });
};
export const fetchGetRoleList = async (params: any) => {
  return await useGet('/roles', { params: { page: params.page ?? 1, perPage: params.perPage ?? 10 } });
};
export const fetchGetMenuList = async (params: any) => {
  return await useGet('/menus', { params: { page: params.page ?? 1, perPage: params.perPage ?? 10 } });
};
export const fetchGetPermissionsList = async (params: any) => {
  return await useGet('/permissions', { params: { page: params.page ?? 1, perPage: params.perPage ?? 10 } });
};
