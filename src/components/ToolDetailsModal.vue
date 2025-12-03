<script setup>
const props = defineProps({
  tool: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close"]);

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

function close() {
  emit("close");
}
</script>

<template>
  <div
    v-if="tool"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
  >
    <div
      class="relative w-full max-w-2xl rounded-xl border border-[#262626] bg-[#050505] p-6 pt-12 text-xs text-[#e5e5e5] shadow-xl"
    >
      <button
        type="button"
        class="absolute right-4 top-3 text-[0.75rem] text-[#a3a3a3] hover:text-white"
        @click="close"
      >
        Close
      </button>

      <div class="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-sm font-semibold text-white">
            {{ tool.name }}
          </h2>
          <p class="mt-1 text-[0.75rem] text-[#a3a3a3]">
            {{ tool.description || "No description provided." }}
          </p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <span
            :class="[
              'inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium',
              getStatusClass(tool.status),
            ]"
          >
            {{ formatStatus(tool.status) }}
          </span>
        </div>
      </div>

      <div class="grid gap-4 border-t border-[#1f2933] pt-4 md:grid-cols-2">
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[0.75rem]">
            <span class="text-[#9ca3af]">Category</span>
            <span class="text-[#e5e5e5]">
              {{ tool.category || "—" }}
            </span>
          </div>
          <div class="flex items-center justify-between text-[0.75rem]">
            <span class="text-[#9ca3af]">Department</span>
            <span class="text-[#e5e5e5]">
              {{ tool.owner_department || "—" }}
            </span>
          </div>
          <div class="flex items-center justify-between text-[0.75rem]">
            <span class="text-[#9ca3af]">Vendor</span>
            <span class="text-[#e5e5e5]">
              {{ tool.vendor || "—" }}
            </span>
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex items-center justify-between text-[0.75rem]">
            <span class="text-[#9ca3af]">Monthly cost</span>
            <span class="text-[#e5e5e5]">
              €{{ tool.monthly_cost?.toLocaleString("fr-FR") ?? "0" }}
            </span>
          </div>
          <div class="flex items-center justify-between text-[0.75rem]">
            <span class="text-[#9ca3af]">Active users</span>
            <span class="text-[#e5e5e5]">
              {{ tool.active_users_count ?? 0 }}
            </span>
          </div>
          <div
            v-if="tool.website_url"
            class="flex items-center justify-between text-[0.75rem]"
          >
            <span class="text-[#9ca3af]">Website</span>
            <a
              :href="tool.website_url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[#60a5fa] hover:underline"
            >
              {{ tool.website_url }}
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-4 grid gap-2 border-t border-[#1f2933] pt-4 text-[0.7rem] text-[#9ca3af] md:grid-cols-2"
      >
        <div>
          <span>Created at:</span>
          <div class="mt-0.5 text-[#e5e5e5]">
            {{ tool.created_at || "—" }}
          </div>
        </div>
        <div>
          <span>Updated at:</span>
          <div class="mt-0.5 text-[#e5e5e5]">
            {{ tool.updated_at || "—" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


