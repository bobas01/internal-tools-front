<script setup>
import { computed } from "vue";
import { LineChart } from "vue-chart-3";
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
  fromColor: {
    type: String,
    default: "#4877FF",
  },
  toColor: {
    type: String,
    default: "#581B94",
  },
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "Monthly Spend",
      data: props.values,
      borderColor: props.toColor,
      backgroundColor: props.fromColor,
      tension: 0.35,
      fill: false,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: "#ffffff",
    },
  ],
}));

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      labels: {
        color: "#e5e5e5",
        font: {
          size: 10,
        },
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      borderColor: "#1f2933",
      borderWidth: 1,
      titleColor: "#e5e5e5",
      bodyColor: "#e5e5e5",
      padding: 8,
      callbacks: {
        label(context) {
          const value = context.parsed.y || 0;
          return `€${value.toLocaleString("fr-FR")}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#9ca3af",
        font: {
          size: 10,
        },
      },
      grid: {
        color: "rgba(55,65,81,0.3)",
      },
    },
    y: {
      ticks: {
        color: "#9ca3af",
        font: {
          size: 10,
        },
        callback(value) {
          return `€${value}`;
        },
      },
      grid: {
        color: "rgba(31,41,55,0.5)",
      },
    },
  },
}));
</script>

<template>
  <div class="h-[28rem] w-full">
    <LineChart :chart-data="chartData" :options="options" />
  </div>
</template>


