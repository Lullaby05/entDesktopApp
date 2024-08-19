import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permission';

function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    // emit route change
    // console.log('emit route change:',to)
    setRouteEmitter(to);
  });
}

export default function createRouteGuard(router: Router) {
  setupUserLoginInfoGuard(router);
  setupPageGuard(router);
  setupPermissionGuard(router);
}
