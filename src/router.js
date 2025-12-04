import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "./pages/DashboardPage.vue";
import ToolsPage from "./pages/ToolsPage.vue";
import AnalyticsPage from "./pages/AnalyticsPage.vue";
import SettingsPage from "./pages/SettingsPage.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardPage },
  { path: "/tools", component: ToolsPage },
  { path: "/analytics", component: AnalyticsPage },
  { path: "/settings", component: SettingsPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
