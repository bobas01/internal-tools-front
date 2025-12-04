import { ref, onMounted } from "vue";

const API_BASE_URL = "https://tt-jsonserver-01.alt-tools.tech";

export function useAnalytics() {
  const analytics = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchAnalytics = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`);
      }
      const data = await response.json();
      analytics.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching analytics", err);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchAnalytics);

  return {
    analytics,
    isLoading,
    error,
    refresh: fetchAnalytics,
  };
}
