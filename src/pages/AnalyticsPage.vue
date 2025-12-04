<script setup>
import { computed } from "vue";
import { useTools } from "../hooks/useTools";
import KpiCard from "../components/KpiCard.vue";
import {
  CurrencyEuroIcon,
  ChartBarIcon,
  BuildingOffice2Icon,
  ArrowTrendingUpIcon,
} from "@heroicons/vue/24/outline";

const { tools, isLoading } = useTools();

const totalCost = computed(() => {
  return tools.value.reduce((sum, tool) => sum + (tool.monthly_cost || 0), 0);
});

const avgCostPerTool = computed(() => {
  if (tools.value.length === 0) return 0;
  return Math.round(totalCost.value / tools.value.length);
});

const costByDepartment = computed(() => {
  const map = new Map();
  tools.value.forEach((tool) => {
    const dept = tool.owner_department || "Unknown";
    const cost = tool.monthly_cost || 0;
    map.set(dept, (map.get(dept) || 0) + cost);
  });
  return Array.from(map.entries())
    .map(([dept, cost]) => ({ dept, cost }))
    .sort((a, b) => b.cost - a.cost);
});

const costByCategory = computed(() => {
  const map = new Map();
  tools.value.forEach((tool) => {
    const cat = tool.category || "Unknown";
    const cost = tool.monthly_cost || 0;
    map.set(cat, (map.get(cat) || 0) + cost);
  });
  return Array.from(map.entries())
    .map(([cat, cost]) => ({ cat, cost }))
    .sort((a, b) => b.cost - a.cost);
});

const topToolsByCost = computed(() => {
  return [...tools.value]
    .filter((t) => t.monthly_cost > 0)
    .sort((a, b) => (b.monthly_cost || 0) - (a.monthly_cost || 0))
    .slice(0, 10);
});

const maxDepartmentCost = computed(() => {
  if (costByDepartment.value.length === 0) return 0;
  return Math.max(...costByDepartment.value.map((d) => d.cost));
});

const maxCategoryCost = computed(() => {
  if (costByCategory.value.length === 0) return 0;
  return Math.max(...costByCategory.value.map((c) => c.cost));
});

const activeToolsCount = computed(() => {
  return tools.value.filter((t) => t.status === "active").length;
});

const totalUsers = computed(() => {
  return tools.value.reduce(
    (sum, tool) => sum + (tool.active_users_count || 0),
    0
  );
});
</script>

<template>
  <main
    class="mx-auto flex w-full flex-col gap-8 px-4 pb-12 pt-8 md:px-10 lg:px-16"
  >
    <section class="space-y-3">
      <h1 class="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Analytics
      </h1>
      <p class="max-w-2xl text-base text-[#a3a3a3] md:text-lg">
        Visualize costs, usage and performance of your internal tools with
        consistent analytics.
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Total Monthly Cost"
        :value="`€${totalCost.toLocaleString('fr-FR')}`"
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#4877FF] to-[#581B94]"
      >
        <template #icon>
          <CurrencyEuroIcon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Average Cost/Tool"
        :value="`€${avgCostPerTool.toLocaleString('fr-FR')}`"
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#22c55e] to-[#16a34a]"
      >
        <template #icon>
          <ChartBarIcon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Active Tools"
        :value="activeToolsCount.toString()"
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#fb7185] to-[#f97316]"
      >
        <template #icon>
          <BuildingOffice2Icon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Total Users"
        :value="totalUsers.toLocaleString('fr-FR')"
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#F52C8D] to-[#EE004C]"
      >
        <template #icon>
          <ArrowTrendingUpIcon class="h-4 w-4" />
        </template>
      </KpiCard>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <section
        class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
      >
        <h2 class="mb-4 text-base font-semibold text-white md:text-lg">
          Cost by Department
        </h2>
        <div v-if="isLoading" class="space-y-3">
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
        </div>
        <div
          v-else-if="costByDepartment.length === 0"
          class="text-sm text-[#737373]"
        >
          No data available
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="item in costByDepartment"
            :key="item.dept"
            class="space-y-1"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#e5e5e5]">{{ item.dept }}</span>
              <span class="font-medium text-white">
                €{{ item.cost.toLocaleString("fr-FR") }}
              </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
              <div
                class="h-full rounded-full bg-gradient-to-r from-[#4877FF] to-[#581B94]"
                :style="{
                  width: `${(item.cost / maxDepartmentCost) * 100}%`,
                }"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
      >
        <h2 class="mb-4 text-base font-semibold text-white md:text-lg">
          Cost by Category
        </h2>
        <div v-if="isLoading" class="space-y-3">
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
        </div>
        <div
          v-else-if="costByCategory.length === 0"
          class="text-sm text-[#737373]"
        >
          No data available
        </div>
        <div v-else class="space-y-3">
          <div v-for="item in costByCategory" :key="item.cat" class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#e5e5e5]">{{ item.cat }}</span>
              <span class="font-medium text-white">
                €{{ item.cost.toLocaleString("fr-FR") }}
              </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
              <div
                class="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#4ade80]"
                :style="{
                  width: `${(item.cost / maxCategoryCost) * 100}%`,
                }"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <section
      class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
    >
      <h2 class="mb-4 text-base font-semibold text-white md:text-lg">
        Top Tools by Cost
      </h2>
      <div v-if="isLoading" class="space-y-3">
        <div class="h-10 w-full animate-pulse rounded bg-[#1a1a1a]" />
        <div class="h-10 w-full animate-pulse rounded bg-[#1a1a1a]" />
      </div>
      <div
        v-else-if="topToolsByCost.length === 0"
        class="text-sm text-[#737373]"
      >
        No data available
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr
              class="border-b border-[#262626] text-xs uppercase text-[#737373]"
            >
              <th class="py-2 pr-4">Rank</th>
              <th class="py-2 px-4">Tool</th>
              <th class="py-2 px-4">Department</th>
              <th class="py-2 px-4">Monthly Cost</th>
              <th class="py-2 px-4">Users</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tool, index) in topToolsByCost"
              :key="tool.id"
              class="border-b border-[#151515] text-sm text-[#e5e5e5] hover:bg-[#0f0f0f]"
            >
              <td class="py-3 pr-4 font-medium text-white">#{{ index + 1 }}</td>
              <td class="py-3 px-4 font-medium text-white">
                {{ tool.name }}
              </td>
              <td class="py-3 px-4 text-[#a3a3a3]">
                {{ tool.owner_department || "—" }}
              </td>
              <td class="py-3 px-4 font-medium text-white">
                €{{ tool.monthly_cost?.toLocaleString("fr-FR") }}
              </td>
              <td class="py-3 px-4">
                {{ tool.active_users_count || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
