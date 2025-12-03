<script setup>
import { ref, computed, watch } from "vue";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";

const tools = [
  {
    name: "Slack",
    icon: "💬",
    iconBg: "bg-[#611f69]",
    department: "Communication",
    users: 245,
    cost: "€2,450",
    status: "Active",
    statusClass: "bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white",
  },
  {
    name: "Figma",
    icon: "🎨",
    iconBg: "bg-[#f24e1e]",
    department: "Design",
    users: 32,
    cost: "€480",
    status: "Active",
    statusClass: "bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white",
  },
  {
    name: "GitHub",
    icon: "⚡",
    iconBg: "bg-[#24292e]",
    department: "Engineering",
    users: 89,
    cost: "€890",
    status: "Active",
    statusClass: "bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white",
  },
  {
    name: "Notion",
    icon: "📝",
    iconBg: "bg-[#000000]",
    department: "Operations",
    users: 156,
    cost: "€780",
    status: "Expiring",
    statusClass: "bg-gradient-to-r from-[#f97316] to-[#facc15] text-black",
  },
  {
    name: "Adobe CC",
    icon: "🎭",
    iconBg: "bg-gradient-to-br from-[#003a9f] to-[#ff0000]",
    department: "Marketing",
    users: 12,
    cost: "€720",
    status: "Unused",
    statusClass: "bg-gradient-to-r from-[#ef4444] to-[#fb7185] text-white",
  },
  {
    name: "Zoom",
    icon: "🎥",
    iconBg: "bg-[#0b5cff]",
    department: "Communication",
    users: 198,
    cost: "€1,980",
    status: "Active",
    statusClass: "bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white",
  },
  {
    name: "Jira",
    icon: "🔧",
    iconBg: "bg-[#0052cc]",
    department: "Engineering",
    users: 67,
    cost: "€670",
    status: "Expiring",
    statusClass: "bg-gradient-to-r from-[#f97316] to-[#facc15] text-black",
  },
  {
    name: "Salesforce",
    icon: "📁",
    iconBg: "bg-[#00a1e0]",
    department: "Sales",
    users: 45,
    cost: "€4,500",
    status: "Active",
    statusClass: "bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white",
  },
];

const pageSize = 10;
const currentPage = ref(1);
const openActionIndex = ref(null);

const statusFilter = ref("all");
const departmentFilter = ref("all");

const departments = computed(() => {
  const set = new Set(tools.map((t) => t.department));
  return Array.from(set);
});

const filteredTools = computed(() => {
  return tools.filter((tool) => {
    const normalizedStatus = tool.status.toLowerCase();

    const matchStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "active" && normalizedStatus === "active") ||
      (statusFilter.value === "expiring" && normalizedStatus === "expiring") ||
      (statusFilter.value === "unused" && normalizedStatus === "unused");

    const matchDepartment =
      departmentFilter.value === "all" ||
      tool.department === departmentFilter.value;

    return matchStatus && matchDepartment;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTools.value.length / pageSize))
);

const pageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTools.value.slice(start, start + pageSize);
});

watch([statusFilter, departmentFilter], () => {
  currentPage.value = 1;
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value -= 1;
}
</script>

<template>
  <section
    class="mt-4 rounded-2xl border border-[#262626] bg-[#050505] px-4 py-4 text-xs shadow-[0_0_0_1px_rgba(0,0,0,0.7)] md:px-6 md:py-5"
  >
    <header class="flex items-center justify-between gap-3 pb-3">
      <h2 class="text-base font-semibold text-white md:text-lg">
        Recent tools
      </h2>
      <div class="flex items-center gap-2 text-[0.7rem] text-[#a3a3a3]">
        <CalendarDaysIcon class="h-4 w-4 text-[#a3a3a3]" />
        <span>Last 30 days</span>
      </div>
    </header>

    <div
      class="mb-3 flex flex-col gap-3 text-[0.7rem] text-[#d4d4d4] sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span class="uppercase tracking-wide text-[#737373]">Filters</span>
        <select
          v-model="statusFilter"
          class="h-7 rounded-md border border-[#262626] bg-[#050505] px-2 text-[0.7rem] text-[#e5e5e5] outline-none focus:border-[#6366f1]"
        >
          <option value="all">Status: All</option>
          <option value="active">Status: Active</option>
          <option value="expiring">Status: Expiring</option>
          <option value="unused">Status: Unused</option>
        </select>
        <select
          v-model="departmentFilter"
          class="h-7 rounded-md border border-[#262626] bg-[#050505] px-2 text-[0.7rem] text-[#e5e5e5] outline-none focus:border-[#6366f1]"
        >
          <option value="all">Department: All</option>
          <option v-for="dep in departments" :key="dep" :value="dep">
            {{ dep }}
          </option>
        </select>
      </div>

      <div class="text-[0.7rem] text-[#a3a3a3]">
        {{ filteredTools.length }}/{{ tools.length }} tools
      </div>
    </div>

    <div class="overflow-x-auto">
      <table
        class="w-full min-w-[720px] text-left text-[0.75rem] text-[#d4d4d4]"
      >
        <thead
          class="border-b border-[#191919] text-[0.7rem] uppercase tracking-wide text-[#737373]"
        >
          <tr>
            <th class="py-2 pr-4 font-medium">Tool</th>
            <th class="py-2 px-4 font-medium">Department</th>
            <th class="py-2 px-4 font-medium">Users</th>
            <th class="py-2 px-4 font-medium">MonthlyCost</th>
            <th class="py-2 px-4 font-medium">Status</th>
            <th class="py-2 px-4 text-right text-[0.65rem] font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(tool, index) in pageItems"
            :key="tool.name"
            class="border-b border-[#111111] last:border-0 hover:bg-[#0f0f0f]"
          >
            <td class="py-3 pr-4">
              <div class="flex items-center gap-3">
                <div class="flex h-7 w-7 items-center justify-center text-sm">
                  <span>
                    {{ tool.icon }}
                  </span>
                </div>
                <span class="text-[0.8rem] font-medium text-white">
                  {{ tool.name }}
                </span>
              </div>
            </td>
            <td class="py-3 px-4 text-[0.75rem] text-[#a3a3a3]">
              {{ tool.department }}
            </td>
            <td class="py-3 px-4 text-[0.8rem]">
              {{ tool.users }}
            </td>
            <td class="py-3 px-4 text-[0.8rem]">
              {{ tool.cost }}
            </td>
            <td class="py-3 px-4">
              <div class="flex justify-start">
                <span
                  :class="[
                    'inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium',
                    tool.statusClass,
                  ]"
                >
                  {{ tool.status }}
                </span>
              </div>
            </td>
            <td class="py-3 px-4 text-right">
              <div class="relative inline-block text-left">
                <button
                  class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#262626] bg-[#050505] text-[0.7rem] text-[#d4d4d4] hover:border-[#404040]"
                  type="button"
                  @click="
                    openActionIndex = openActionIndex === index ? null : index
                  "
                >
                  ⋮
                </button>
                <div
                  v-if="openActionIndex === index"
                  class="absolute right-0 z-20 mt-1 w-28 rounded-md border border-[#262626] bg-[#050505] py-1 text-[0.7rem] text-[#e5e5e5] shadow-lg"
                >
                  <button
                    class="block w-full px-3 py-1 text-left hover:bg-[#111111]"
                    type="button"
                  >
                    View
                  </button>
                  <button
                    class="block w-full px-3 py-1 text-left hover:bg-[#111111]"
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    class="block w-full px-3 py-1 text-left text-rose-400 hover:bg-[#111111]"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-3 flex items-center justify-between gap-3 text-[0.7rem] text-[#a3a3a3]"
    >
      <span> Page {{ currentPage }} / {{ totalPages }} </span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-full border border-[#262626] px-2 py-1 hover:border-[#404040] disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Prev
        </button>
        <button
          type="button"
          class="rounded-full border border-[#262626] px-2 py-1 hover:border-[#404040] disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </section>
</template>
