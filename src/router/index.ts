// Composables
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Dashboard from "@/views/Dashboard.vue";
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "/login",
        name: "login",
        component: Login,
      },
      {
        path: "/register",
        name: "Register",
        component: Register,
      },
      {
        path: "/dashboard",
        name: "Dashboard",
        beforeEnter: authGuard,
        component: Dashboard,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

import { useUserStore } from "@/store/user";
import { auth } from "@/firebase-config";
import { setMaxIdleHTTPParsers } from "http";
// @ts-ignore
function authGuard(to, from, next) {
  const userStore = useUserStore();
  const isAuth = userStore.isAuth;
  if (isAuth) next();
  else next("/login");
}
