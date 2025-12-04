<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useTools } from "../hooks/useTools";
import { useAnalytics } from "../hooks/useAnalytics";
import KpiCard from "../components/KpiCard.vue";
import BaseLineChart from "../components/BaseLineChart.vue";
import BaseDonutChart from "../components/BaseDonutChart.vue";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CurrencyEuroIcon,
  ChartBarIcon,
  BuildingOffice2Icon,
  ArrowTrendingUpIcon,
} from "@heroicons/vue/24/outline";

const { tools, isLoading } = useTools();
const {
  analytics,
  isLoading: isAnalyticsLoading,
  error: analyticsError,
} = useAnalytics();

const timeRange = ref("30d");
const selectedDepartment = ref("all");

const totalCost = computed(() => {
  return tools.value.reduce((sum, tool) => sum + (tool.monthly_cost || 0), 0);
});

const avgCostPerTool = computed(() => {
  if (tools.value.length === 0) return 0;
  return Math.round(totalCost.value / tools.value.length);
});

const costByDepartment = computed(() => {
  const map = new Map();
  tools.value.forEach((tool) => {
    const dept = tool.owner_department || "Unknown";
    const cost = tool.monthly_cost || 0;
    map.set(dept, (map.get(dept) || 0) + cost);
  });
  return Array.from(map.entries())
    .map(([dept, cost]) => ({ dept, cost }))
    .sort((a, b) => b.cost - a.cost);
});

const costByCategory = computed(() => {
  const map = new Map();
  tools.value.forEach((tool) => {
    const cat = tool.category || "Unknown";
    const cost = tool.monthly_cost || 0;
    map.set(cat, (map.get(cat) || 0) + cost);
  });
  return Array.from(map.entries())
    .map(([cat, cost]) => ({ cat, cost }))
    .sort((a, b) => b.cost - a.cost);
});

const topToolsByCost = computed(() => {
  return [...tools.value]
    .filter((t) => t.monthly_cost > 0)
    .sort((a, b) => (b.monthly_cost || 0) - (a.monthly_cost || 0))
    .slice(0, 10);
});

const maxDepartmentCost = computed(() => {
  if (costByDepartment.value.length === 0) return 0;
  return Math.max(...costByDepartment.value.map((d) => d.cost));
});

const maxCategoryCost = computed(() => {
  if (costByCategory.value.length === 0) return 0;
  return Math.max(...costByCategory.value.map((c) => c.cost));
});

const activeToolsCount = computed(() => {
  return tools.value.filter((t) => t.status === "active").length;
});

const totalUsers = computed(() => {
  return tools.value.reduce(
    (sum, tool) => sum + (tool.active_users_count || 0),
    0
  );
});

const budgetOverview = computed(() => analytics.value?.budget_overview || null);

const budgetLimit = computed(() => budgetOverview.value?.monthly_limit ?? 0);

const budgetCurrent = computed(
  () => budgetOverview.value?.current_month_total ?? 0
);

const budgetPrevious = computed(
  () => budgetOverview.value?.previous_month_total ?? 0
);

const budgetUtilizationValue = computed(() => {
  if (!budgetOverview.value) return 0;
  if (budgetOverview.value.budget_utilization) {
    const parsed = parseFloat(
      String(budgetOverview.value.budget_utilization).replace("%", "")
    );
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (!budgetLimit.value) return 0;
  return Math.round((budgetCurrent.value / budgetLimit.value) * 100);
});

const budgetTrendValue = computed(() => {
  if (!budgetOverview.value?.trend_percentage) return 0;
  const parsed = parseFloat(
    String(budgetOverview.value.trend_percentage).replace("%", "")
  );
  return Number.isNaN(parsed) ? 0 : parsed;
});

const previousMonthTotalCost = computed(() => {
  return tools.value.reduce(
    (sum, tool) => sum + (tool.previous_month_cost || 0),
    0
  );
});

const monthlySpendLabels = computed(() => {
  return ["Previous Month", "Current Month"];
});

const monthlySpendValues = computed(() => {
  return [previousMonthTotalCost.value, totalCost.value];
});

const departments = computed(() => {
  const set = new Set();
  tools.value.forEach((tool) => {
    if (tool.owner_department) {
      set.add(tool.owner_department);
    }
  });
  return Array.from(set).sort();
});

function isInTimeRange(dateString, range) {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  if (range === "30d") {
    return now.getTime() - date.getTime() <= 30 * oneDay;
  }
  if (range === "90d") {
    return now.getTime() - date.getTime() <= 90 * oneDay;
  }
  if (range === "1y") {
    return now.getTime() - date.getTime() <= 365 * oneDay;
  }
  return true;
}

const usageFilteredTools = computed(() => {
  let result = [...tools.value];

  result = result.filter((tool) => {
    const refDate = tool.updated_at || tool.created_at;
    return isInTimeRange(refDate, timeRange.value);
  });

  if (selectedDepartment.value !== "all") {
    result = result.filter(
      (tool) => tool.owner_department === selectedDepartment.value
    );
  }

  return result;
});

const mostUsedTools = computed(() => {
  return [...usageFilteredTools.value]
    .filter((t) => (t.active_users_count || 0) > 0)
    .sort((a, b) => (b.active_users_count || 0) - (a.active_users_count || 0))
    .slice(0, 5);
});

const leastUsedTools = computed(() => {
  return [...usageFilteredTools.value]
    .sort((a, b) => (a.active_users_count || 0) - (b.active_users_count || 0))
    .slice(0, 5);
});

const departmentActivity = computed(() => {
  const map = new Map();
  usageFilteredTools.value.forEach((tool) => {
    const dept = tool.owner_department || "Unknown";
    const users = tool.active_users_count || 0;
    map.set(dept, (map.get(dept) || 0) + users);
  });

  return Array.from(map.entries())
    .map(([dept, users]) => ({ dept, users }))
    .sort((a, b) => b.users - a.users);
});

const maxDepartmentUsers = computed(() => {
  if (departmentActivity.value.length === 0) return 0;
  return Math.max(...departmentActivity.value.map((d) => d.users));
});

const growthTimeline = computed(() => {
  const counts = new Map();
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  let daysBack = 180;
  if (timeRange.value === "30d") {
    daysBack = 30;
  } else if (timeRange.value === "90d") {
    daysBack = 90;
  } else if (timeRange.value === "1y") {
    daysBack = 365;
  }

  const start = new Date(now.getTime() - daysBack * oneDay);

  tools.value.forEach((tool) => {
    if (!tool.created_at) return;
    const created = new Date(tool.created_at);
    if (Number.isNaN(created.getTime())) return;
    if (created < start || created > now) return;

    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const label = created.toLocaleDateString("en-US", {
      month: "short",
    });

    if (!counts.has(key)) {
      counts.set(key, {
        label,
        count: 0,
        date: new Date(created.getFullYear(), created.getMonth(), 1),
      });
    }
    const entry = counts.get(key);
    entry.count += 1;
  });

  const sorted = Array.from(counts.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return sorted.map(({ label, count }) => ({ label, count }));
});

const maxGrowthCount = computed(() => {
  if (growthTimeline.value.length === 0) return 0;
  return Math.max(...growthTimeline.value.map((m) => m.count));
});

const unusedTools = computed(() => {
  return tools.value.filter(
    (tool) => tool.status === "unused" || (tool.active_users_count || 0) === 0
  );
});

const expensiveLowUsageTools = computed(() => {
  return tools.value
    .filter((tool) => {
      const users = tool.active_users_count || 0;
      if (!tool.monthly_cost || users === 0) return false;
      const costPerUser = tool.monthly_cost / users;
      return costPerUser > 200;
    })
    .sort((a, b) => {
      const aCpu = a.monthly_cost / (a.active_users_count || 1);
      const bCpu = b.monthly_cost / (b.active_users_count || 1);
      return bCpu - aCpu;
    })
    .slice(0, 3);
});

const savingsPotential = computed(() => {
  return unusedTools.value.reduce(
    (sum, tool) => sum + (tool.monthly_cost || 0),
    0
  );
});

const averageCostPerActiveUser = computed(() => {
  const totalActiveUsers = tools.value.reduce(
    (sum, tool) => sum + (tool.active_users_count || 0),
    0
  );
  if (totalActiveUsers === 0) return 0;
  return Math.round(totalCost.value / totalActiveUsers);
});

function exportAnalyticsReport() {
  if (!tools.value.length) return;

  const headers = [
    "id",
    "name",
    "owner_department",
    "category",
    "status",
    "monthly_cost",
    "previous_month_cost",
    "active_users_count",
    "created_at",
    "updated_at",
  ];

  const lines = [headers.join(",")];

  tools.value.forEach((tool) => {
    const row = [
      tool.id,
      `"${(tool.name || "").replace(/"/g, '""')}"`,
      `"${(tool.owner_department || "").replace(/"/g, '""')}"`,
      `"${(tool.category || "").replace(/"/g, '""')}"`,
      tool.status || "",
      tool.monthly_cost ?? "",
      tool.previous_month_cost ?? "",
      tool.active_users_count ?? "",
      tool.created_at || "",
      tool.updated_at || "",
    ];
    lines.push(row.join(","));
  });

  const csvContent = lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 10);
  a.download = `analytics-tools-report-${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper function to format numbers without non-breaking spaces for PDF
function formatNumberForPDF(num) {
  return num
    .toLocaleString("fr-FR")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ");
}

function exportAnalyticsReportPDF() {
  if (!tools.value.length) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text("Analytics Report", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const formattedDate = new Date().toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated on ${formattedDate}`, pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 15;

  // KPIs Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Key Performance Indicators", 14, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const kpiData = [
    ["Total Monthly Cost", `€${formatNumberForPDF(totalCost.value)}`],
    ["Average Cost/Tool", `€${formatNumberForPDF(avgCostPerTool.value)}`],
    ["Active Tools", activeToolsCount.value.toString()],
    ["Total Users", formatNumberForPDF(totalUsers.value)],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Metric", "Value"]],
    body: kpiData,
    theme: "striped",
    headStyles: { fillColor: [71, 119, 255] },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });
  yPos = doc.lastAutoTable.finalY + 15;

  // Budget Overview
  if (budgetOverview.value) {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Budget Overview", 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    const budgetData = [
      ["Monthly Limit", `€${formatNumberForPDF(budgetLimit.value)}`],
      ["Current Month Total", `€${formatNumberForPDF(budgetCurrent.value)}`],
      ["Previous Month Total", `€${formatNumberForPDF(budgetPrevious.value)}`],
      ["Utilization", `${budgetUtilizationValue.value}%`],
      [
        "Trend",
        `${budgetTrendValue.value > 0 ? "+" : ""}${budgetTrendValue.value}%`,
      ],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["Metric", "Value"]],
      body: budgetData,
      theme: "striped",
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });
    yPos = doc.lastAutoTable.finalY + 15;
  }

  // Cost by Department
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Cost by Department", 14, yPos);
  yPos += 8;

  const deptData = costByDepartment.value.map((d) => [
    d.dept,
    `€${formatNumberForPDF(d.cost)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Department", "Monthly Cost"]],
    body: deptData,
    theme: "striped",
    headStyles: { fillColor: [71, 119, 255] },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });
  yPos = doc.lastAutoTable.finalY + 15;

  // Cost by Category
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Cost by Category", 14, yPos);
  yPos += 8;

  const catData = costByCategory.value.map((c) => [
    c.cat,
    `€${formatNumberForPDF(c.cost)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Category", "Monthly Cost"]],
    body: catData,
    theme: "striped",
    headStyles: { fillColor: [249, 115, 22] },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });
  yPos = doc.lastAutoTable.finalY + 15;

  // Top Tools by Cost
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Top Tools by Cost", 14, yPos);
  yPos += 8;

  const topToolsData = topToolsByCost.value
    .slice(0, 10)
    .map((tool) => [
      tool.name,
      tool.owner_department || "—",
      `€${formatNumberForPDF(tool.monthly_cost || 0)}`,
      (tool.active_users_count || 0).toString(),
    ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Tool", "Department", "Monthly Cost", "Users"]],
    body: topToolsData,
    theme: "striped",
    headStyles: { fillColor: [236, 72, 153] },
    styles: { fontSize: 8 },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 50 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
    },
  });
  yPos = doc.lastAutoTable.finalY + 15;

  // Unused Tools
  if (unusedTools.value.length > 0) {
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Unused Tools Warnings", 14, yPos);
    yPos += 8;

    const unusedData = unusedTools.value
      .slice(0, 10)
      .map((tool) => [
        tool.name,
        tool.owner_department || "—",
        `€${formatNumberForPDF(tool.monthly_cost || 0)}`,
        (tool.active_users_count || 0).toString(),
      ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Tool", "Department", "Monthly Cost", "Users"]],
      body: unusedData,
      theme: "striped",
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
      },
    });
    yPos = doc.lastAutoTable.finalY + 15;
  }

  // Expensive Low Usage Tools
  if (expensiveLowUsageTools.value.length > 0) {
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Cost Optimization Alerts", 14, yPos);
    yPos += 8;

    const expensiveData = expensiveLowUsageTools.value.map((tool) => {
      const costPerUser = Math.round(
        (tool.monthly_cost || 0) / (tool.active_users_count || 1)
      );
      return [
        tool.name,
        tool.owner_department || "—",
        `€${formatNumberForPDF(tool.monthly_cost || 0)}`,
        (tool.active_users_count || 0).toString(),
        `€${formatNumberForPDF(costPerUser)}/user`,
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [["Tool", "Department", "Monthly Cost", "Users", "Cost/User"]],
      body: expensiveData,
      theme: "striped",
      headStyles: { fillColor: [239, 68, 68] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 40 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
      },
    });
  }

  // Save PDF
  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`analytics-tools-report-${timestamp}.pdf`);
}
</script>

<template>
  <main
    class="mx-auto flex w-full flex-col gap-8 px-4 pb-12 pt-8 md:px-10 lg:px-16"
  >
    <section
      class="flex flex-col gap-4 border-b border-[#111111] pb-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div class="space-y-3">
        <h1
          class="text-2xl font-semibold tracking-tight text-white md:text-3xl"
        >
          Analytics
        </h1>
        <p class="max-w-2xl text-base text-[#a3a3a3] md:text-lg">
          Visualize costs, usage and performance of your internal tools with
          consistent analytics.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-[#262626] bg-[#050505] px-3 py-1 text-[0.75rem] font-medium text-[#e5e5e5] hover:bg-[#111111]"
          @click="exportAnalyticsReport"
        >
          Export report (CSV)
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-[#262626] bg-[#050505] px-3 py-1 text-[0.75rem] font-medium text-[#e5e5e5] hover:bg-[#111111]"
          @click="exportAnalyticsReportPDF"
        >
          Export report (PDF)
        </button>
      </div>
    </section>

    <section
      class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
    >
      <h2 class="mb-3 text-base font-semibold text-white md:text-lg">
        Budget Progress
      </h2>
      <div
        v-if="isAnalyticsLoading"
        class="h-16 w-full animate-pulse rounded-xl bg-[#111111]"
      />
      <div v-else-if="analyticsError" class="text-sm text-[#f97316]">
        Failed to load budget analytics.
      </div>
      <div v-else-if="!budgetOverview" class="text-sm text-[#737373]">
        No budget data available.
      </div>
      <div v-else class="space-y-4 text-sm text-[#e5e5e5]">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-[0.75rem] uppercase tracking-wide text-[#9ca3af]">
              Monthly Budget Utilization
            </p>
            <p class="mt-1 text-2xl font-semibold text-white">
              {{ budgetUtilizationValue }}%
            </p>
          </div>
          <div class="text-right text-[0.75rem] text-[#9ca3af]">
            <p>
              Current:
              <span class="font-semibold text-white">
                €{{ budgetCurrent.toLocaleString("fr-FR") }}
              </span>
            </p>
            <p>
              Limit:
              <span class="font-semibold text-white">
                €{{ budgetLimit.toLocaleString("fr-FR") }}
              </span>
            </p>
          </div>
        </div>

        <div class="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
          <div
            class="h-full rounded-full bg-gradient-to-r from-[#4877FF] via-[#22c55e] to-[#f97316]"
            :style="{
              width: `${Math.min(budgetUtilizationValue, 130)}%`,
            }"
          />
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-[0.75rem] text-[#9ca3af]">
            Previous month:
            <span class="font-medium text-white">
              €{{ budgetPrevious.toLocaleString("fr-FR") }}
            </span>
          </p>
          <p
            class="text-[0.75rem] font-medium"
            :class="
              budgetTrendValue > 0
                ? 'text-[#22c55e]'
                : budgetTrendValue < 0
                ? 'text-[#f97316]'
                : 'text-[#9ca3af]'
            "
          >
            Trend:
            <span v-if="budgetTrendValue > 0">+{{ budgetTrendValue }}%</span>
            <span v-else>{{ budgetTrendValue }}%</span>
          </p>
        </div>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Total Monthly Cost"
        :value="`€${totalCost.toLocaleString('fr-FR')}`"
        delta=""
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#4877FF] to-[#581B94]"
      >
        <template #icon>
          <CurrencyEuroIcon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Average Cost/Tool"
        :value="`€${avgCostPerTool.toLocaleString('fr-FR')}`"
        delta=""
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#22c55e] to-[#16a34a]"
      >
        <template #icon>
          <ChartBarIcon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Active Tools"
        :value="activeToolsCount.toString()"
        delta=""
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#fb7185] to-[#f97316]"
      >
        <template #icon>
          <BuildingOffice2Icon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Total Users"
        :value="totalUsers.toLocaleString('fr-FR')"
        delta=""
        deltaType="neutral"
        iconBgClass="bg-gradient-to-br from-[#F52C8D] to-[#EE004C]"
      >
        <template #icon>
          <ArrowTrendingUpIcon class="h-4 w-4" />
        </template>
      </KpiCard>
    </section>

    <section
      class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
    >
      <h2 class="mb-4 text-base font-semibold text-white md:text-lg">
        Cost Analytics
      </h2>
      <div class="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 class="mb-2 text-sm font-semibold text-white">
            Monthly Spend Evolution
          </h3>
          <p class="mb-3 text-[0.7rem] text-[#9ca3af]">
            Compare previous and current month total spend across all tools.
          </p>
          <div
            class="rounded-xl border border-[#262626] bg-[#050505] p-3 overflow-visible"
          >
            <BaseLineChart
              :labels="monthlySpendLabels"
              :values="monthlySpendValues"
              from-color="#4877FF"
              to-color="#581B94"
            />
          </div>
        </div>

        <div>
          <h3 class="mb-2 text-sm font-semibold text-white">
            Department Cost Breakdown
          </h3>
          <p class="mb-3 text-[0.7rem] text-[#9ca3af]">
            Distribution of current monthly spend by owner department.
          </p>
          <div
            class="rounded-xl border border-[#262626] bg-[#050505] p-3 overflow-visible"
          >
            <BaseDonutChart
              :labels="costByDepartment.map((d) => d.dept)"
              :values="costByDepartment.map((d) => d.cost)"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <section
        class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
      >
        <h2 class="mb-4 text-base font-semibold text-white md:text-lg">
          Cost by Department
        </h2>
        <div v-if="isLoading" class="space-y-3">
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
        </div>
        <div
          v-else-if="costByDepartment.length === 0"
          class="text-sm text-[#737373]"
        >
          No data available
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="item in costByDepartment"
            :key="item.dept"
            class="space-y-1"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#e5e5e5]">{{ item.dept }}</span>
              <span class="font-medium text-white">
                €{{ item.cost.toLocaleString("fr-FR") }}
              </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
              <div
                class="h-full rounded-full bg-gradient-to-r from-[#4877FF] to-[#581B94]"
                :style="{
                  width: `${(item.cost / maxDepartmentCost) * 100}%`,
                }"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
      >
        <h2 class="mb-4 text-base font-semibold text-white md:text-lg">
          Cost by Category
        </h2>
        <div v-if="isLoading" class="space-y-3">
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
          <div class="h-4 w-full animate-pulse rounded bg-[#1a1a1a]" />
        </div>
        <div
          v-else-if="costByCategory.length === 0"
          class="text-sm text-[#737373]"
        >
          No data available
        </div>
        <div v-else class="space-y-3">
          <div v-for="item in costByCategory" :key="item.cat" class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#e5e5e5]">{{ item.cat }}</span>
              <span class="font-medium text-white">
                €{{ item.cost.toLocaleString("fr-FR") }}
              </span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
              <div
                class="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#4ade80]"
                :style="{
                  width: `${(item.cost / maxCategoryCost) * 100}%`,
                }"
              />
            </div>
          </div>
        </div>
      </section>
    </div>

    <section
      class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
    >
      <h2 class="mb-4 text-base font-semibold text-white md:text-lg">
        Top Tools by Cost
      </h2>
      <div v-if="isLoading" class="space-y-3">
        <div class="h-10 w-full animate-pulse rounded bg-[#1a1a1a]" />
        <div class="h-10 w-full animate-pulse rounded bg-[#1a1a1a]" />
      </div>
      <div
        v-else-if="topToolsByCost.length === 0"
        class="text-sm text-[#737373]"
      >
        No data available
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr
              class="border-b border-[#262626] text-xs uppercase text-[#737373]"
            >
              <th class="py-2 pr-4">Rank</th>
              <th class="py-2 px-4">Tool</th>
              <th class="py-2 px-4">Department</th>
              <th class="py-2 px-4">Monthly Cost</th>
              <th class="py-2 px-4">Users</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tool, index) in topToolsByCost"
              :key="tool.id"
              class="border-b border-[#151515] text-sm text-[#e5e5e5] hover:bg-[#0f0f0f]"
            >
              <td class="py-3 pr-4 font-medium text-white">#{{ index + 1 }}</td>
              <td class="py-3 px-4 font-medium text-white">
                {{ tool.name }}
              </td>
              <td class="py-3 px-4 text-[#a3a3a3]">
                {{ tool.owner_department || "—" }}
              </td>
              <td class="py-3 px-4 font-medium text-white">
                €{{ tool.monthly_cost?.toLocaleString("fr-FR") }}
              </td>
              <td class="py-3 px-4">
                {{ tool.active_users_count || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section
      class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
    >
      <div
        class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-base font-semibold text-white md:text-lg">
            Usage Analytics
          </h2>
          <p class="mt-1 text-[0.7rem] text-[#9ca3af]">
            Adoption, activity and growth based on usage data.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="inline-flex items-center gap-1 rounded-full border border-[#262626] bg-[#050505] p-1 text-[0.7rem] text-[#a3a3a3]"
          >
            <button
              type="button"
              class="rounded-full px-2 py-1 transition"
              :class="
                timeRange === '30d'
                  ? 'bg-gradient-to-r from-[#4877FF] to-[#581B94] text-white shadow-sm'
                  : 'hover:bg-[#111111]'
              "
              @click="timeRange = '30d'"
            >
              30d
            </button>
            <button
              type="button"
              class="rounded-full px-2 py-1 transition"
              :class="
                timeRange === '90d'
                  ? 'bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-sm'
                  : 'hover:bg-[#111111]'
              "
              @click="timeRange = '90d'"
            >
              90d
            </button>
            <button
              type="button"
              class="rounded-full px-2 py-1 transition"
              :class="
                timeRange === '1y'
                  ? 'bg-gradient-to-r from-[#F97316] to-[#FB7185] text-white shadow-sm'
                  : 'hover:bg-[#111111]'
              "
              @click="timeRange = '1y'"
            >
              1y
            </button>
          </div>

          <div class="text-[0.7rem] text-[#9ca3af]">
            <label class="mr-1 text-[#737373]">Department</label>
            <select
              v-model="selectedDepartment"
              class="rounded-full border border-[#262626] bg-[#050505] px-2 py-1 text-[0.7rem] text-[#e5e5e5] outline-none"
            >
              <option value="all">All</option>
              <option v-for="dept in departments" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4">
          <div>
            <h3 class="mb-2 text-s font-semibold text-[#fff ]">
              Most Used Tools
            </h3>
            <div
              v-if="mostUsedTools.length === 0"
              class="text-[0.75rem] text-[#737373]"
            >
              No usage data in this range.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="tool in mostUsedTools"
                :key="tool.id"
                class="space-y-1"
              >
                <div class="flex items-center justify-between text-xs">
                  <div>
                    <p class="font-medium text-white">
                      {{ tool.name }}
                    </p>
                    <p class="text-[0.7rem] text-[#9ca3af]">
                      {{ tool.owner_department || "—" }}
                    </p>
                  </div>
                  <p class="text-xs font-semibold text-white">
                    {{ tool.active_users_count || 0 }} users
                  </p>
                </div>
                <div class="h-1.5 w-full rounded-full bg-[#1a1a1a]">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]"
                    :style="{
                      width: `${
                        mostUsedTools[0].active_users_count
                          ? ((tool.active_users_count || 0) /
                              mostUsedTools[0].active_users_count) *
                            100
                          : 0
                      }%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-s font-semibold text-[#fff ]">
              Least Used Tools
            </h3>
            <div
              v-if="leastUsedTools.length === 0"
              class="text-[0.75rem] text-[#737373]"
            >
              No usage data in this range.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="tool in leastUsedTools"
                :key="tool.id"
                class="space-y-1"
              >
                <div class="flex items-center justify-between text-xs">
                  <div>
                    <p class="font-medium text-white">
                      {{ tool.name }}
                    </p>
                    <p class="text-[0.7rem] text-[#9ca3af]">
                      {{ tool.owner_department || "—" }}
                    </p>
                  </div>
                  <p class="text-xs font-semibold text-white">
                    {{ tool.active_users_count || 0 }} users
                  </p>
                </div>
                <div class="h-1.5 w-full rounded-full bg-[#1a1a1a]">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#FB7185]"
                    :style="{
                      width: `${
                        leastUsedTools[leastUsedTools.length - 1]
                          .active_users_count
                          ? ((tool.active_users_count || 0) /
                              (leastUsedTools[leastUsedTools.length - 1]
                                .active_users_count || 1)) *
                            100
                          : 0
                      }%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="mb-2 text-s font-semibold text-[#fff ]">
              Department Activity
            </h3>
            <div
              v-if="departmentActivity.length === 0"
              class="text-[0.75rem] text-[#737373]"
            >
              No activity data in this range.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="item in departmentActivity"
                :key="item.dept"
                class="space-y-1"
              >
                <div class="flex items-center justify-between text-[0.7rem]">
                  <span class="text-[#e5e5e5]">{{ item.dept }}</span>
                  <span class="text-[#9ca3af]"> {{ item.users }} users </span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-[#1a1a1a]">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#6366f1]"
                    :style="{
                      width: `${
                        maxDepartmentUsers
                          ? (item.users / maxDepartmentUsers) * 100
                          : 0
                      }%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-s font-semibold text-[#fff ]">
              Growth Trends (New Tools)
            </h3>
            <div
              v-if="growthTimeline.length === 0"
              class="text-[0.75rem] text-[#737373]"
            >
              No new tools in this range.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="point in growthTimeline"
                :key="point.label"
                class="space-y-1"
              >
                <div class="flex items-center justify-between text-[0.7rem]">
                  <span class="text-[#e5e5e5]">{{ point.label }}</span>
                  <span class="text-[#9ca3af]">
                    {{ point.count }} new tools
                  </span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-[#1a1a1a]">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#a3e635]"
                    :style="{
                      width: `${
                        maxGrowthCount
                          ? (point.count / maxGrowthCount) * 100
                          : 0
                      }%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="rounded-xl border border-[#262626] bg-[#060606]/80 px-4 py-6 shadow-sm sm:px-6"
    >
      <div
        class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-base font-semibold text-white md:text-lg">
            Insights & Alerts
          </h2>
          <p class="mt-1 text-[0.7rem] text-[#9ca3af]">
            Cost optimization, unused tools and ROI signals based on your data.
          </p>
        </div>
        <div class="flex gap-2 text-[0.7rem] text-[#a3a3a3]">
          <RouterLink
            to="/tools"
            class="inline-flex items-center gap-1 rounded-full border border-[#262626] bg-[#050505] px-3 py-1 hover:bg-[#111111]"
          >
            <span class="text-[#e5e5e5]">Go to Tools</span>
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="inline-flex items-center gap-1 rounded-full border border-[#262626] bg-[#050505] px-3 py-1 hover:bg-[#111111]"
          >
            <span class="text-[#e5e5e5]">Back to Dashboard</span>
          </RouterLink>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div
          class="space-y-3 rounded-xl border border-[#1f2933] bg-[#020617] px-4 py-3"
        >
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold text-white">
              Cost Optimization Alerts
            </h3>
            <span
              class="inline-flex items-center rounded-full bg-[#1e293b] px-2 py-0.5 text-[0.65rem] font-medium text-[#e5e5e5]"
            >
              {{ expensiveLowUsageTools.length }} tools
            </span>
          </div>
          <p class="text-[0.7rem] text-[#9ca3af]">
            Tools with a very high cost per active user.
          </p>
          <div
            v-if="expensiveLowUsageTools.length === 0"
            class="text-[0.75rem] text-[#737373]"
          >
            No critical cost issues detected.
          </div>
          <ul v-else class="space-y-2 text-[0.75rem]">
            <li
              v-for="tool in expensiveLowUsageTools"
              :key="tool.id"
              class="flex items-center justify-between"
            >
              <div>
                <p class="font-medium text-white">
                  {{ tool.name }}
                </p>
                <p class="text-[0.7rem] text-[#9ca3af]">
                  {{ tool.owner_department || "—" }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs font-semibold text-[#f97316]">
                  €{{
                    Math.round(
                      (tool.monthly_cost || 0) / (tool.active_users_count || 1)
                    ).toLocaleString("fr-FR")
                  }}
                  / user
                </p>
                <p class="text-[0.65rem] text-[#9ca3af]">
                  {{ tool.active_users_count || 0 }} users
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div
          class="space-y-3 rounded-xl border border-[#1f2933] bg-[#020617] px-4 py-3"
        >
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold text-white">
              Unused Tools Warnings
            </h3>
            <span
              class="inline-flex items-center rounded-full bg-[#1e293b] px-2 py-0.5 text-[0.65rem] font-medium text-[#e5e5e5]"
            >
              {{ unusedTools.length }} tools
            </span>
          </div>
          <p class="text-[0.7rem] text-[#9ca3af]">
            Tools with zero or very low usage that still generate costs.
          </p>
          <div
            v-if="unusedTools.length === 0"
            class="text-[0.75rem] text-[#737373]"
          >
            No unused tools detected.
          </div>
          <ul v-else class="space-y-1 text-[0.75rem]">
            <li
              v-for="tool in unusedTools.slice(0, 4)"
              :key="tool.id"
              class="flex items-center justify-between"
            >
              <div>
                <p class="font-medium text-white">
                  {{ tool.name }}
                </p>
                <p class="text-[0.7rem] text-[#9ca3af]">
                  Status: {{ tool.status }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs font-semibold text-white">
                  €{{ (tool.monthly_cost || 0).toLocaleString("fr-FR") }}
                </p>
                <p class="text-[0.65rem] text-[#9ca3af]">
                  {{ tool.active_users_count || 0 }} users
                </p>
              </div>
            </li>
          </ul>
          <p v-if="unusedTools.length > 4" class="text-[0.7rem] text-[#6b7280]">
            +{{ unusedTools.length - 4 }} more tools with no usage.
          </p>
        </div>

        <div
          class="space-y-3 rounded-xl border border-[#1f2933] bg-[#020617] px-4 py-3"
        >
          <h3 class="text-sm font-semibold text-white">ROI & Usage Snapshot</h3>
          <p class="text-[0.7rem] text-[#9ca3af]">
            High-level ROI and adoption metrics for your current portfolio.
          </p>
          <div class="grid grid-cols-2 gap-3 text-[0.75rem]">
            <div>
              <p class="text-[0.7rem] text-[#9ca3af]">
                Avg cost per active user
              </p>
              <p class="text-base font-semibold text-white">
                €{{ averageCostPerActiveUser.toLocaleString("fr-FR") }}
              </p>
            </div>
            <div>
              <p class="text-[0.7rem] text-[#9ca3af]">Unused tools spend</p>
              <p class="text-base font-semibold text-[#f97316]">
                €{{ savingsPotential.toLocaleString("fr-FR") }}
              </p>
            </div>
            <div>
              <p class="text-[0.7rem] text-[#9ca3af]">Active tools</p>
              <p class="text-base font-semibold text-white">
                {{ activeToolsCount }}
              </p>
            </div>
            <div>
              <p class="text-[0.7rem] text-[#9ca3af]">Total tools</p>
              <p class="text-base font-semibold text-white">
                {{ tools.length }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
