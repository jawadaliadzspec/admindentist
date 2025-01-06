import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { useGet, usePost } from '@awal/axios';
import { storage } from '@awal/storage';
import { ACCESS_TOKEN } from '@/constants/auth';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());
  const permissions = reactive<Array<string>>([]);

  const userInfo: Api.Auth.UserInfo = reactive({
    id: 0,
    name: '',
    email: '',
    phone_number: '',
    status: 0,
    roles: [],
    permissions: []
  });

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;
    const hasSuperRole = userInfo.roles.some((role: any) => role?.name === VITE_STATIC_SUPER_ROLE);
    return VITE_AUTH_ROUTE_MODE === 'static' && hasSuperRole;
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  async function login(email: string, password: string, redirect = true) {
    startLoading();

    const res = await usePost('/auth/login', { email, password });

    if (res.data) {
      const pass = await loginByToken(res.data.token);

      if (pass) {
        await routeStore.initAuthRoute();

        await redirectFromLogin(redirect);

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            message: $t('page.login.common.welcomeBack', { name: userInfo.name }),
            duration: 4500
          });
        }
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    storage.set(ACCESS_TOKEN, loginToken);

    // 2. get user info
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken;

      return true;
    }

    return false;
  }

  async function allPermissions(user: Api.Auth.UserInfo) {
    // Extract permissions from roles
    const rolePermissions =
      user?.roles?.flatMap((role: any) =>
        role.permissions.map((permission: any) => permission.name)
      ) || [];

    // Extract direct user-specific permissions
    const userPermissions = user?.permissions.map((permission: any) => permission.name) || [];

    // Merge and deduplicate permissions
    const mergedPermissions = Array.from(new Set([...rolePermissions, ...userPermissions]));

    // Update the reactive permissions array
    permissions.splice(0, permissions.length, ...mergedPermissions);
  }

  async function getUserInfo() {
    const res = await useGet('/auth/authenticated');

    if (res.data) {
      // update store
      Object.assign(userInfo, res.data);
      // Properly update the permissions array
      await allPermissions(res.data);
      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  return {
    token,
    userInfo,
    permissions,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo
  };
});
