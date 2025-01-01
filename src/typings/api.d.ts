/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    interface Pagination {
      page: number;
      perPage: number;
      total: number;
    }

    interface PaginationRecord<T = any> extends Pagination {
      data: T[];
    }

    type PaginationParams = Pick<Common.Pagination, 'page' | 'perPage'>;

    type Status = '0' | '1';

    type CommonRecord<T = any> = {
      index: number;
      id: number;

      status: Status | undefined;
    } & T;
  }

  namespace Auth {
    interface LoginToken {
      token: string;
    }

    interface UserInfo {
      id: number;
      name: string;
      email: string;
      phone_number: string;
      status: number;
      roles: string[];
      permissions: string[];
    }
  }

  namespace SystemManage {
    type PaginationParams = Pick<Common.Pagination, 'page' | 'perPage'>;
    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      name: string;
      /** role code */
      // roleCode: string;
      /** role description */
      // roleDesc: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'name' | 'status'> & PaginationParams
    >;
    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
      | 'i18nKey'
      | 'keepAlive'
      | 'constant'
      | 'order'
      | 'href'
      | 'hideInMenu'
      | 'activeMenu'
      | 'multiTab'
      | 'fixedIndexInTab'
      | 'query'
    >;
  }
}
