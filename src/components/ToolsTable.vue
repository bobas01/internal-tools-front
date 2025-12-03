<script setup>
import { ref } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["view"]);

const iconErrorById = ref({});

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
  <table class="w-full min-w-[760px] text-left text-sm">
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
        <th class="py-2 px-4 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="tool in items"
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
        <td class="py-2 px-4 text-right">
          <button
            type="button"
            class="rounded-md border border-[#262626] px-2 py-1 text-[0.7rem] text-[#e5e5e5] hover:border-[#404040]"
            @click="emit('view', tool)"
          >
            View
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


