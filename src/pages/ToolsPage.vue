<script setup>
import { ref, computed, watch } from "vue";
import { useTools } from "../hooks/useTools";
import { useGlobalSearch } from "../hooks/useGlobalSearch";

const { tools, isLoading, error } = useTools();
const { searchQuery } = useGlobalSearch();
const iconErrorById = ref({});

const statusFilter = ref("all");
const departmentFilter = ref("all");

const pageSize = 10;
const currentPage = ref(1);

const departments = computed(() => {
  const set = new Set(
    tools.value.map((t) => t.owner_department).filter(Boolean)
  );
  return Array.from(set);
});

const filteredTools = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();

  return tools.value.filter((tool) => {
    const matchSearch = !q || tool.name.toLowerCase().includes(q);

    const matchStatus =
      statusFilter.value === "all" ||
      (statusFilter.value === "active" && tool.status === "active") ||
      (statusFilter.value === "expiring" && tool.status === "expiring") ||
      (statusFilter.value === "unused" && tool.status === "unused");

    const matchDepartment =
      departmentFilter.value === "all" ||
      tool.owner_department === departmentFilter.value;

    return matchSearch && matchStatus && matchDepartment;
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

function getCategoryIcon(category) {
  const normalized = (category || "").toLowerCase();

  if (normalized.includes("design")) return "🎨";
  if (normalized.includes("communication") || normalized.includes("chat"))
    return "💬";
  if (normalized.includes("development") || normalized.includes("engineering"))
    return "⚙️";
  if (normalized.includes("analytics") || normalized.includes("data"))
    return "📊";
  if (normalized.includes("marketing")) return "📣";
  if (normalized.includes("sales")) return "💼";
  if (normalized.includes("project")) return "📋";

  return "🧩";
}

function getStatusClass(status) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "active") {
    return "bg-gradient-to-r from-[#16a34a] to-[#22c55e] text-white";
  }
  if (normalized === "expiring") {
    return "bg-gradient-to-r from-[#f97316] to-[#facc15] text-black";
  }
  if (normalized === "unused") {
    return "bg-gradient-to-r from-[#ef4444] to-[#fb7185] text-white";
  }
  return "bg-[#27272a] text-[#e5e5e5]";
}

function formatStatus(status) {
  if (!status) return "";
  const s = String(status);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function handleIconError(id) {
  iconErrorById.value = { ...iconErrorById.value, [id]: true };
}
</script>

<template>
  <main
    class="mx-auto flex w-full flex-col gap-8 px-4 pb-12 pt-8 md:px-10 lg:px-16"
  >
    <section class="space-y-3">
      <h1 class="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Tools catalog
      </h1>
      <p class="max-w-2xl text-base text-[#a3a3a3] md:text-lg">
        Explore, filter and manage all the SaaS tools used across your
        organization.
      </p>
    </section>

    <section
      class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
    >
      <div
        class="mb-4 flex flex-col gap-3 text-xs text-[#d4d4d4] sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-[0.7rem] uppercase tracking-wide text-[#737373]">
            Filters
          </span>
          <select
            v-model="statusFilter"
            class="h-8 rounded-md border border-[#262626] bg-[#050505] px-2 text-xs text-[#e5e5e5] outline-none focus:border-[#6366f1]"
          >
            <option value="all">Status: All</option>
            <option value="active">Status: Active</option>
            <option value="expiring">Status: Expiring</option>
            <option value="unused">Status: Unused</option>
          </select>
          <select
            v-model="departmentFilter"
            class="h-8 rounded-md border border-[#262626] bg-[#050505] px-2 text-xs text-[#e5e5e5] outline-none focus:border-[#6366f1]"
          >
            <option value="all">Department: All</option>
            <option v-for="dep in departments" :key="dep" :value="dep">
              {{ dep }}
            </option>
          </select>
        </div>

        <div class="text-[0.7rem] text-[#a3a3a3]">
          {{ filteredTools.length }} tools • Page {{ currentPage }} of
          {{ totalPages }}
        </div>
      </div>

      <div v-if="isLoading" class="space-y-3">
        <div class="h-4 w-40 animate-pulse rounded bg-[#1a1a1a]" />
        <div class="h-10 w-full animate-pulse rounded bg-[#111111]" />
        <div class="h-10 w-full animate-pulse rounded bg-[#111111]" />
      </div>

      <div v-else-if="error" class="text-sm text-rose-400">
        Error loading tools: {{ error }}
      </div>

      <div v-else>
        <p class="mb-3 text-sm text-[#a3a3a3]">
          {{ filteredTools.length }}/{{ tools.length }} tools displayed
        </p>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr
                class="border-b border-[#262626] text-xs uppercase text-[#737373]"
              >
                <th class="py-2 pr-4">Tool</th>
                <th class="py-2 px-4">Category</th>
                <th class="py-2 px-4">Department</th>
                <th class="py-2 px-4">Users</th>
                <th class="py-2 px-4">Monthly cost</th>
                <th class="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tool in pageItems"
                :key="tool.id"
                class="border-b border-[#151515] text-sm text-[#e5e5e5] hover:bg-[#0f0f0f]"
              >
                <td
                  class="flex items-center gap-2 py-2 pr-4 font-medium text-white"
                >
                  <span
                    v-if="!tool.icon_url || iconErrorById[tool.id]"
                    class="text-base"
                  >
                    {{ getCategoryIcon(tool.category) }}
                  </span>
                  <img
                    v-else
                    :src="tool.icon_url"
                    :alt="tool.name"
                    class="h-4 w-4"
                    @error="handleIconError(tool.id)"
                  />
                  <span>{{ tool.name }}</span>
                </td>
                <td class="py-2 px-4 text-[#a3a3a3]">
                  {{ tool.category }}
                </td>
                <td class="py-2 px-4 text-[#a3a3a3]">
                  {{ tool.owner_department }}
                </td>
                <td class="py-2 px-4">
                  {{ tool.active_users_count }}
                </td>
                <td class="py-2 px-4">
                  €{{ tool.monthly_cost?.toLocaleString("fr-FR") }}
                </td>
                <td class="py-2 px-4">
                  <div class="flex justify-start">
                    <span
                      :class="[
                        'inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium',
                        getStatusClass(tool.status),
                      ]"
                    >
                      {{ formatStatus(tool.status) }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="mt-4 flex items-center justify-between gap-3 text-[0.7rem] text-[#a3a3a3]"
        >
          <span>
            Showing
            {{
              Math.min(filteredTools.length, (currentPage - 1) * pageSize + 1)
            }}
            -
            {{ Math.min(filteredTools.length, currentPage * pageSize) }}
            of {{ filteredTools.length }}
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-md border border-[#262626] px-2 py-1 text-[0.7rem] text-[#e5e5e5] disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#404040]"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              Prev
            </button>
            <button
              type="button"
              class="rounded-md border border-[#262626] px-2 py-1 text-[0.7rem] text-[#e5e5e5] disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#404040]"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
