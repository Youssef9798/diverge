import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/Content/DashboardView.vue'
import Users from '@/views/Content/Users/UsersView.vue'
import UsersCreate from '@/views/Content/Users/CreateUserView.vue'
import UserView from '@/views/Content/Users/UserView.vue'
import Login from '@/views/Auth/LoginView.vue'
import NotFound from '@/views/Content/NotFound.vue'
import UnAuth from '@/views/Auth/UnauthView.vue'

import { routeGuardMiddleware } from '@/middleware/routeGuard'
import { loadLayoutMiddleware } from '@/middleware/loadLayout'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        permissions: ['view_dashboard'],
        layout: 'AuthenticatedLayout',
      },
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: {
        permissions: ['view_users'],
        layout: 'AuthenticatedLayout',
      },
    },
    {
      path: '/users/create',
      name: 'UsersCreate',
      component: UsersCreate,
      meta: {
        permissions: ['view_users', 'add_users'],
        layout: 'AuthenticatedLayout',
      },
    },
    {
      path: '/users/:id',
      name: 'UserProfile',
      component: UserView,
      meta: {
        permissions: ['view_user', 'edit_users'],
        layout: 'AuthenticatedLayout',
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        layout: 'DefaultLayout',
      },
    },
    {
      path: '/401',
      name: 'Unauth',
      component: UnAuth,
      meta: {
        layout: 'DefaultLayout',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound,
      meta: {
        layout: 'DefaultLayout',
      },
    },
  ],
})

router.beforeEach(loadLayoutMiddleware)
router.beforeEach(routeGuardMiddleware)

export default router
