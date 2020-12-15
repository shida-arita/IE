import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/search',
    component: () => import('@/views/search.vue'),
  },
  {
    path: '/pic',
    component: () => import('@/views/pic.vue'),
  },
  {
    path: '/download',
    component: () => import('@/views/download.vue'),
  }
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
  });
  (router as any).matcher = (newRouter as any).matcher
}

export default router
