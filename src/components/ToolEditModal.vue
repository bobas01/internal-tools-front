<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  tool: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const editError = ref("");

const editedTool = ref({
  name: "",
  category: "",
  owner_department: "",
  status: "active",
  monthly_cost: "",
  active_users_count: "",
  description: "",
  vendor: "",
  website_url: "",
});

watch(
  () => props.open,
  (val) => {
    if (val && props.tool) {
      editedTool.value = {
        name: props.tool.name || "",
        category: props.tool.category || "",
        owner_department: props.tool.owner_department || "",
        status: props.tool.status || "active",
        monthly_cost: props.tool.monthly_cost ?? "",
        active_users_count: props.tool.active_users_count ?? "",
        description: props.tool.description || "",
        vendor: props.tool.vendor || "",
        website_url: props.tool.website_url || "",
      };
      editError.value = "";
    }
  }
);

function close() {
  emit("close");
}

function submit() {
  editError.value = "";

  if (!editedTool.value.name.trim()) {
    editError.value = "Name is required.";
    return;
  }
  if (!editedTool.value.category.trim()) {
    editError.value = "Category is required.";
    return;
  }
  if (!editedTool.value.owner_department.trim()) {
    editError.value = "Department is required.";
    return;
  }
  if (
    editedTool.value.monthly_cost === "" ||
    editedTool.value.monthly_cost === null ||
    editedTool.value.monthly_cost === undefined
  ) {
    editError.value = "Monthly cost is required.";
    return;
  }

  const costNumber = Number(editedTool.value.monthly_cost);
  if (Number.isNaN(costNumber) || costNumber < 0) {
    editError.value = "Monthly cost must be a positive number.";
    return;
  }

  const usersNumber = editedTool.value.active_users_count
    ? Number(editedTool.value.active_users_count)
    : 0;

  if (Number.isNaN(usersNumber) || usersNumber < 0) {
    editError.value = "Users count must be a positive number.";
    return;
  }

  emit("submit", {
    id: props.tool?.id,
    name: editedTool.value.name.trim(),
    category: editedTool.value.category.trim(),
    owner_department: editedTool.value.owner_department.trim(),
    status: editedTool.value.status,
    monthly_cost: costNumber,
    active_users_count: usersNumber,
    description: editedTool.value.description.trim(),
    vendor: editedTool.value.vendor.trim(),
    website_url: editedTool.value.website_url.trim(),
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
        <h2 class="text-sm font-semibold text-white">Edit tool</h2>
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
            v-model="editedTool.name"
            type="text"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Category</label>
          <input
            v-model="editedTool.category"
            type="text"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Department</label>
          <input
            v-model="editedTool.owner_department"
            type="text"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-[0.7rem] text-[#a3a3a3]">Status</label>
            <select
              v-model="editedTool.status"
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
              v-model="editedTool.monthly_cost"
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
            v-model="editedTool.active_users_count"
            type="number"
            min="0"
            step="1"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Description</label>
          <textarea
            v-model="editedTool.description"
            rows="2"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Vendor</label>
          <input
            v-model="editedTool.vendor"
            type="text"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[0.7rem] text-[#a3a3a3]">Website URL</label>
          <input
            v-model="editedTool.website_url"
            type="url"
            class="w-full rounded-md border border-[#262626] bg-[#050505] px-2 py-1 text-xs text-white outline-none focus:border-[#6366f1]"
          />
        </div>

        <p v-if="editError" class="text-[0.7rem] text-rose-400">
          {{ editError }}
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
            Update tool
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

