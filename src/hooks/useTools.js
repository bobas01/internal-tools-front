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
      tools.value = data;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Erreur inconnue lors du chargement des outils";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchTools);

  return {
    tools,
    isLoading,
    error,
    refresh: fetchTools,
  };
}


