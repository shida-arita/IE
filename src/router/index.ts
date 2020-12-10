import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/index.vue'),
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  });
  (router as any).matcher = (newRouter as any).matcher
}

export default router
