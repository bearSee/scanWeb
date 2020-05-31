import Vue from 'vue';
import Router from 'vue-router';
import routeConfig from './route-config';

Vue.use(Router);
const router = new Router(routeConfig);
router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;
  next();
});

export function resetRouter() {
  const newRouter = new Router(routeConfig);
  router.matcher = newRouter.matcher;
}

export default router;
