// import { useGet } from '@awal/axios';
import { useGet } from '~/packages/axios/src/use-get';
export const fetchGetUserList = async (params: any) => {
  return await useGet('/users', { params: { page: params.current, perPage: params.size } });
};
export const fetchGetRoleList = async (params: any) => {
  return await useGet('/roles', { params: { page: params.current, perPage: params.size } });
};
export const fetchGetMenuList = async (params: any) => {
  return await useGet('/menus', { params: { page: params.current, perPage: params.size } });
};
export const fetchGetPermissionsList = async (params: any) => {
  return await useGet('/permissions', { params: { page: params.current, perPage: params.size } });
};
