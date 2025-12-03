import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "./pages/DashboardPage.vue";
import ToolsPage from "./pages/ToolsPage.vue";
import AnalyticsPage from "./pages/AnalyticsPage.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardPage },
  { path: "/tools", component: ToolsPage },
  { path: "/analytics", component: AnalyticsPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

