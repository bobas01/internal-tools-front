<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "submit"]);

const createError = ref("");

const newTool = ref({
  name: "",
  category: "",
  owner_department: "",
  status: "active",
  monthly_cost: "",
  active_users_count: "",
});

watch(
  () => props.open,
  (val) => {
    if (val) {
      resetForm();
    }
  }
);

function resetForm() {
  newTool.value = {
    name: "",
    category: "",
    owner_department: "",
    status: "active",
    monthly_cost: "",
    active_users_count: "",
  };
  createError.value = "";
}

function close() {
  emit("close");
}

function submit() {
  createError.value = "";

  if (!newTool.value.name.trim()) {
    createError.value = "Name is required.";
    return;
  }
  if (!newTool.value.category.trim()) {
    createError.value = "Category is required.";
    return;
  }
  if (!newTool.value.owner_department.trim()) {
    createError.value = "Department is required.";
    return;
  }
  if (
    newTool.value.monthly_cost === "" ||
    newTool.value.monthly_cost === null ||
    newTool.value.monthly_cost === undefined
  ) {
    createError.value = "Monthly cost is required.";
    return;
  }

  const costNumber = Number(newTool.value.monthly_cost);
  if (Number.isNaN(costNumber) || costNumber < 0) {
    createError.value = "Monthly cost must be a positive number.";
    return;
  }

  const usersNumber = newTool.value.active_users_count
    ? Number(newTool.value.active_users_count)
    : 0;

  if (Number.isNaN(usersNumber) || usersNumber < 0) {
    createError.value = "Users count must be a positive number.";
    return;
  }

  emit("submit", {
    name: newTool.value.name.trim(),
    category: newTool.value.category.trim(),
    owner_department: newTool.value.owner_department.trim(),
    status: newTool.value.status,
    monthly_cost: costNumber,
    active_users_count: usersNumber,
  });

  close();
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
  >
    <div
      class="w-full max-w-md rounded-xl border border-[#262626] bg-[#050505] p-5 text-xs text-[#e5e5e5] shadow-xl"
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <h2 class="text-sm font-semibold text-white">Add new tool</h2>
        <button
          type="button"
          class="text-[0.75rem] text-[#a3a3a3] hover:text-white"
          @click="close"
        >
          Close
        </button>
      </div>

      <form class="space-y-3" @submit.prevent="submit">
        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Name</label>
          <input
            v-model="newTool.name"
            type="text"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Category</label>
          <input
            v-model="newTool.category"
            type="text"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Department</label>
          <input
            v-model="newTool.owner_department"
            type="text"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-[0.7rem] text-[#a3a3a3]">Status</label>
            <select
              v-model="newTool.status"
              class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
            >
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="unused">Unused</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-[0.7rem] text-[#a3a3a3]">
              Monthly cost (€)
            </label>
            <input
              v-model="newTool.monthly_cost"
              type="number"
              min="0"
              step="1"
              class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">
            Active users
          </label>
          <input
            v-model="newTool.active_users_count"
            type="number"
            min="0"
            step="1"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <p v-if="createError" class="text-[0.7rem] text-rose-400">
          {{ createError }}
        </p>

        <div class="mt-3 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-md border border-[#262626] px-3 py-1.5 text-[0.75rem] text-[#e5e5e5] hover:border-[#404040]"
            @click="close"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md bg-white text-[0.75rem] font-medium text-black px-3 py-1.5 hover:bg-[#e5e5e5]"
          >
            Save tool
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


