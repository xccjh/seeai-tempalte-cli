import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { DemoConstructRoute } from '../views/demo-construct'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/login',
    meta: {
      name: '首页'
    }
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '/layout/Login.vue'),
    name: 'login',
    meta: {
      name: '登录'
    }
  },
  DemoConstructRoute('/demo-construct/:id')
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
