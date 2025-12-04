import { ref, onMounted } from "vue";

export function useTools() {
  const tools = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchTools = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch("https://tt-jsonserver-01.alt-tools.tech/tools");
      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }
      const data = await res.json();
      tools.value = data.map((tool) => ({
        ...tool,
        monthly_cost:
          tool.monthly_cost !== undefined && tool.monthly_cost !== null
            ? Number(tool.monthly_cost)
            : 0,
        previous_month_cost:
          tool.previous_month_cost !== undefined &&
          tool.previous_month_cost !== null
            ? Number(tool.previous_month_cost)
            : 0,
        active_users_count:
          tool.active_users_count !== undefined &&
          tool.active_users_count !== null
            ? Number(tool.active_users_count)
            : 0,
      }));
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Erreur inconnue lors du chargement des outils";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchTools);

  const addLocalTool = (partialTool) => {
    const maxId = tools.value.reduce(
      (max, t) => (typeof t.id === "number" ? Math.max(max, t.id) : max),
      0
    );

    const now = new Date().toISOString();

    tools.value = [
      {
        id: maxId + 1,
        name: partialTool.name,
        description: partialTool.description || "",
        vendor: partialTool.vendor || "",
        category: partialTool.category,
        monthly_cost: partialTool.monthly_cost,
        previous_month_cost:
          partialTool.previous_month_cost ?? partialTool.monthly_cost,
        owner_department: partialTool.owner_department,
        status: partialTool.status,
        website_url: partialTool.website_url || "",
        active_users_count: partialTool.active_users_count ?? 0,
        icon_url: partialTool.icon_url || "",
        created_at: now,
        updated_at: now,
      },
      ...tools.value,
    ];
  };

  const updateLocalTool = (toolId, updates) => {
    const index = tools.value.findIndex((t) => t.id === toolId);
    if (index === -1) return;

    const now = new Date().toISOString();
    const existing = tools.value[index];

    tools.value[index] = {
      ...existing,
      ...updates,
      updated_at: now,
    };
  };

  const updateLocalStatus = (toolId, newStatus) => {
    updateLocalTool(toolId, { status: newStatus });
  };

  return {
    tools,
    isLoading,
    error,
    refresh: fetchTools,
    addLocalTool,
    updateLocalTool,
    updateLocalStatus,
  };
}
