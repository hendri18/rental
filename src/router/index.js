import { createRouter, createWebHistory } from 'vue-router/auto'

import LandingLayout from '@/views/LandingLayout.vue'
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LandingView from '@/views/LandingView.vue';
import DashboardLayout from '@/views/dashboard/DashboardLayout.vue';
import auth from '@/services/auth';
import Logout from '@/views/Logout.vue';
import OrderHistoryView from '@/views/OrderHistoryView.vue';
import DataCarView from '@/views/dashboard/DataCarView.vue';
import DataOrderView from '@/views/dashboard/DataOrderView.vue';
import UserManagementView from '@/views/dashboard/UserManagementView.vue';

const routes = [
    { 
        path: '/', 
        component: LandingLayout,
        children: [
            { path: '/', component: LandingView },
            { path: '/home', component: LandingView },
            { path: '/order-history', component: OrderHistoryView, meta: { checkAuth: true } },
            
        ]
    },
    { path: '/login', component: LoginView, meta: { checkLoggedIn: true } },
    { path: '/register', component: RegisterView, meta: { checkLoggedIn: true } },
    { 
        path: '/logout', 
        beforeEnter: async (to, from, next) => {
            await auth.logout();
            location.href = '/login';
        },
        component: Logout,
    },
    { 
        path: '/dashboard', 
        component: DashboardLayout,
        meta: { checkAuth: true, adminRoute: true },
        children: [
            { path: '', component: DataCarView, meta: { checkAuth: true, adminRoute: true }, },
            { path: 'data-car', component: DataCarView, meta: { checkAuth: true, adminRoute: true }, },
            { path: 'data-order', component: DataOrderView, meta: { checkAuth: true, adminRoute: true }, },
            { path: 'user-management', component: UserManagementView, meta: { checkAuth: true, adminRoute: true }, },
        ]
    }
]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from) => {
    if (auth.isLoggedIn() && auth.isAdmin() && !to.meta.adminRoute && to.path != '/logout') {
        return {
            path: '/dashboard',
        }
    }
    if (to.meta.checkAuth) {
        if (!auth.isLoggedIn()) {
            return {
                path: '/login',
                // query: { redirect: to.fullPath },
            }
        } else {
            if (to.meta.adminRoute && !auth.isAdmin()) {
                return {
                    path: '/',
                }
            }
        }
    }
    if (to.meta.checkLoggedIn && auth.isLoggedIn()) {
        return {
            path: '/',
        }
    }
});

export default router
