import { computed, nextTick, ref, shallowRef } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { useBoolean } from '@sa/hooks';
import type { ElegantConstRoute, RouteKey, RouteMap } from '@elegant-router/types';
import { SetupStoreId } from '@/enum';
import { router } from '@/router';
import { createStaticRoutes, getAuthVueRoutes } from '@/router/routes';
import { getRouteName } from '@/router/elegant/transform';
import { useAuthStore } from '../auth';
import { useTabStore } from '../tab';
import {
  filterAuthRoutesByRoles,
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getGlobalMenusByAuthRoutes,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
  transformMenuToSearchMenus,
  updateLocaleOfGlobalMenus
} from './shared';

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const authStore = useAuthStore();
  const tabStore = useTabStore();
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean();
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean();

  const authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE);

  /** Home route key */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME);

  /** constant routes */
  const constantRoutes = shallowRef<ElegantConstRoute[]>([]);

  function addConstantRoutes(routes: ElegantConstRoute[]) {
    const constantRoutesMap = new Map<string, ElegantConstRoute>([]);

    routes.forEach(route => {
      constantRoutesMap.set(route.name, route);
    });

    constantRoutes.value = Array.from(constantRoutesMap.values());
  }

  /** auth routes */
  const authRoutes = shallowRef<ElegantConstRoute[]>([]);

  function addAuthRoutes(routes: ElegantConstRoute[]) {
    const authRoutesMap = new Map<string, ElegantConstRoute>([]);

    routes.forEach(route => {
      authRoutesMap.set(route.name, route);
    });

    authRoutes.value = Array.from(authRoutesMap.values());
  }

  const removeRouteFns: (() => void)[] = [];

  /** Global menus */
  const menus = ref<App.Global.Menu[]>([]);
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value));

  /** Get global menus */
  function getGlobalMenus(routes: ElegantConstRoute[]) {
    menus.value = getGlobalMenusByAuthRoutes(routes);
  }

  /** Update global menus by locale */
  function updateGlobalMenusByLocale() {
    menus.value = updateLocaleOfGlobalMenus(menus.value);
  }

  /** Cache routes */
  const cacheRoutes = ref<RouteKey[]>([]);
  const excludeCacheRoutes = ref<RouteKey[]>([]);
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes);
  }
  async function resetRouteCache(routeKey?: RouteKey) {
    const routeName = routeKey || (router.currentRoute.value.name as RouteKey);

    excludeCacheRoutes.value.push(routeName);

    await nextTick();

    excludeCacheRoutes.value = [];
  }

  /** Global breadcrumbs */
  const breadcrumbs = computed(() => getBreadcrumbsByRoute(router.currentRoute.value, menus.value));

  /** Reset store */
  async function resetStore() {
    const routeStore = useRouteStore();
    routeStore.$reset();
    resetVueRoutes();
    await initConstantRoute();
  }

  /** Reset vue routes */
  function resetVueRoutes() {
    removeRouteFns.forEach(fn => fn());
    removeRouteFns.length = 0;
  }

  /** init constant route */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) return;
    const staticRoute = createStaticRoutes();
    if (authRouteMode.value === 'static') {
      addConstantRoutes(staticRoute.constantRoutes);
    }
    handleConstantAndAuthRoutes();
    setIsInitConstantRoute(true);
  }

  /** Init auth route */
  async function initAuthRoute() {
    if (!authStore.userInfo.id) {
      await authStore.initUserInfo();
    }
    if (authRouteMode.value === 'static') {
      initStaticAuthRoute();
    }
    tabStore.initHomeTab();
  }

  /** Init static auth route */
  function initStaticAuthRoute() {
    const { authRoutes: staticAuthRoutes } = createStaticRoutes();
    if (authStore.isStaticSuper) {
      addAuthRoutes(staticAuthRoutes);
    } else {
      const filteredAuthRoutes = filterAuthRoutesByRoles(staticAuthRoutes, authStore.permissions);
      addAuthRoutes(filteredAuthRoutes);
    }
    handleConstantAndAuthRoutes();
    setIsInitAuthRoute(true);
  }

  /** handle constant and auth routes */
  function handleConstantAndAuthRoutes() {
    const allRoutes = [...constantRoutes.value, ...authRoutes.value];
    const sortRoutes = sortRoutesByOrder(allRoutes);
    const vueRoutes = getAuthVueRoutes(sortRoutes);
    resetVueRoutes();
    addRoutesToVueRouter(vueRoutes);
    getGlobalMenus(sortRoutes);
    getCacheRoutes(vueRoutes);
  }

  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach(route => {
      const removeFn = router.addRoute(route);
      addRemoveRouteFn(removeFn);
    });
  }

  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn);
  }

  async function getIsAuthRouteExist(routePath: RouteMap[RouteKey]) {
    const routeName = getRouteName(routePath);
    if (!routeName) {
      return false;
    }

    if (authRouteMode.value === 'static') {
      const { authRoutes: staticAuthRoutes } = createStaticRoutes();
      return isRouteExistByRouteName(routeName, staticAuthRoutes);
    }
    return false;
  }

  function getSelectedMenuKeyPath(selectedKey: string) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value);
  }

  async function onRouteSwitchWhenLoggedIn() {
    authStore.initUserInfo();
  }

  async function onRouteSwitchWhenNotLoggedIn() {
    // some global init logic if it does not need to be logged in
  }

  return {
    resetStore,
    routeHome,
    menus,
    searchMenus,
    updateGlobalMenusByLocale,
    cacheRoutes,
    excludeCacheRoutes,
    resetRouteCache,
    breadcrumbs,
    initConstantRoute,
    isInitConstantRoute,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getIsAuthRouteExist,
    getSelectedMenuKeyPath,
    onRouteSwitchWhenLoggedIn,
    onRouteSwitchWhenNotLoggedIn
  };
});
