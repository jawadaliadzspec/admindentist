import { useGet } from '@awal/axios';

export const fetchGetUserList = async (params: any) => {
  return await useGet('/users', { params: { page: params.current, perPage: params.size } });
};
