<script setup>
import { ref, computed, watch } from "vue";
import { useTools } from "../hooks/useTools";
import { useGlobalSearch } from "../hooks/useGlobalSearch";
import ToolsTable from "../components/ToolsTable.vue";
import ToolCreateModal from "../components/ToolCreateModal.vue";
import ToolDetailsModal from "../components/ToolDetailsModal.vue";

const { tools, isLoading, error, addLocalTool } = useTools();
const { searchQuery } = useGlobalSearch();

const statusFilter = ref("all");
const departmentFilter = ref("all");
const categoryFilter = ref("all");
const costMin = ref("");
const costMax = ref("");

const pageSize = 10;
const currentPage = ref(1);

const isCreateOpen = ref(false);
const selectedTool = ref(null);

const departments = computed(() => {
  const set = new Set(
    tools.value.map((t) => t.owner_department).filter(Boolean)
  );
  return Array.from(set);
});

const categories = computed(() => {
  const set = new Set(tools.value.map((t) => t.category).filter(Boolean));
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

    const matchCategory =
      categoryFilter.value === "all" || tool.category === categoryFilter.value;

    const costNumber = Number(tool.monthly_cost ?? 0);
    const minOk =
      costMin.value === "" || costNumber >= Number(costMin.value || 0);
    const maxOk =
      costMax.value === "" || costNumber <= Number(costMax.value || 0);

    return (
      matchSearch &&
      matchStatus &&
      matchDepartment &&
      matchCategory &&
      minOk &&
      maxOk
    );
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTools.value.length / pageSize))
);

const pageItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTools.value.slice(start, start + pageSize);
});

watch(
  [statusFilter, departmentFilter, categoryFilter, costMin, costMax],
  () => {
    currentPage.value = 1;
  }
);

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value += 1;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value -= 1;
}

function onAddToolClick() {
  isCreateOpen.value = true;
}

function handleCreateSubmit(payload) {
  addLocalTool(payload);
}

function openDetails(tool) {
  selectedTool.value = tool;
}

function closeDetails() {
  selectedTool.value = null;
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
          <select
            v-model="categoryFilter"
            class="h-8 rounded-md border border-[#262626] bg-[#050505] px-2 text-xs text-[#e5e5e5] outline-none focus:border-[#6366f1]"
          >
            <option value="all">Category: All</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
          <div class="flex items-center gap-1">
            <span class="text-[0.7rem] text-[#737373]">Cost:</span>
            <input
              v-model="costMin"
              type="number"
              min="0"
              class="w-16 rounded-md border border-[#262626] bg-[#050505] px-1 py-1 text-[0.7rem] text-[#e5e5e5] outline-none focus:border-[#6366f1]"
              placeholder="Min"
            />
            <span class="text-[0.7rem] text-[#737373]">-</span>
            <input
              v-model="costMax"
              type="number"
              min="0"
              class="w-16 rounded-md border border-[#262626] bg-[#050505] px-1 py-1 text-[0.7rem] text-[#e5e5e5] outline-none focus:border-[#6366f1]"
              placeholder="Max"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-[0.7rem] text-[#a3a3a3]">
            {{ filteredTools.length }} tools • Page {{ currentPage }} of
            {{ totalPages }}
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-white/5 px-3 py-1.5 text-[0.75rem] font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10"
            @click="onAddToolClick"
          >
            Add tool
          </button>
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
          <ToolsTable :items="pageItems" @view="openDetails" />
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

    <ToolCreateModal
      :open="isCreateOpen"
      @close="isCreateOpen = false"
      @submit="handleCreateSubmit"
    />

    <ToolDetailsModal :tool="selectedTool" @close="closeDetails" />
  </main>
</template>
