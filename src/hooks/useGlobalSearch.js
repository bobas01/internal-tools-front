import { ref } from "vue";

const query = ref("");

export function useGlobalSearch() {
  return {
    searchQuery: query,
  };
}


