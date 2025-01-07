import { useAuthStore } from '@/store/modules/auth';

// import { isSuperAdmin } from '@src/checks/isSuperAdmin';

export function usePermission() {
  const userStore = useAuthStore();

  function somePermissions(accesses: string[]) {
    return userStore.permissions.some((item: any) => {
      return accesses.includes(item);
    });
  }

  function hasPermission(accesses: string[]): boolean {
    if (userStore.isStaticSuper) {
      return true;
    }
    return somePermissions(accesses);
  }

  return { hasPermission };
}
