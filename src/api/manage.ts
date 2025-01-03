import { useGet } from '@awal/axios';

export const fetchGetUserList = async (params: any) => {
  return await useGet('/users', { params: { page: params.current, perPage: params.size } });
};
export const fetchGetRoleList = async (params: any) => {
  return await useGet('/roles', { params: { page: params.current, perPage: params.size } });
};
export const fetchGetMenuList = async (params: any) => {
  return await useGet('/menus', { params: { page: params.current, perPage: params.size } });
};
