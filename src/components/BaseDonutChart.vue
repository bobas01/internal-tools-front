<script setup>
import { computed } from "vue";
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  values: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    default: () => [
      "#4877FF",
      "#581B94",
      "#22c55e",
      "#f97316",
      "#ec4899",
      "#06b6d4",
    ],
  },
});

const chartData = computed(() => {
  const baseColors = props.colors;
  const dataLength = props.values.length;

  const backgroundColors =
    dataLength <= baseColors.length
      ? baseColors.slice(0, dataLength)
      : Array.from({ length: dataLength }, (_, i) => baseColors[i % baseColors.length]);

  return {
    labels: props.labels,
    datasets: [
      {
        data: props.values,
        backgroundColor: backgroundColors,
        borderColor: "#020617",
        borderWidth: 1,
      },
    ],
  };
});

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: "65%",
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "#e5e5e5",
        font: {
          size: 10,
        },
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      borderColor: "#1f2933",
      borderWidth: 1,
      titleColor: "#e5e5e5",
      bodyColor: "#e5e5e5",
      padding: 8,
      callbacks: {
        label(context) {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: €${value.toLocaleString("fr-FR")}`;
        },
      },
    },
  },
}));
</script>

<template>
  <div class="h-[28rem] w-full">
    <DoughnutChart :chart-data="chartData" :options="options" />
  </div>
</template>


