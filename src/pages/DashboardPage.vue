<script setup>
import KpiCard from "../components/KpiCard.vue";
import {
  ArrowTrendingUpIcon,
  WrenchIcon,
  BuildingOffice2Icon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
</script>

<template>
  <main
    class="mx-auto flex w-full flex-col gap-8 px-4 pb-12 pt-8 md:px-10 lg:px-16"
  >
    <section class="space-y-3">
      <h1 class="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Internal Tools Dashboard
      </h1>
      <p class="max-w-2xl text-base text-[#a3a3a3] md:text-lg">
        Monitor and manage your organization's software tools and expenses.
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Monthly Budget"
        value="€28,750"
        secondary="/€30k"
        delta="+12%"
        deltaType="positive"
        iconBgClass="bg-gradient-to-br from-[#22c55e] to-[#16a34a]"
        deltaBgClass="bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-white"
      >
        <template #icon>
          <ArrowTrendingUpIcon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Active Tools"
        value="147"
        delta="+8"
        deltaType="positive"
        iconBgClass="bg-gradient-to-br from-[#4877FF] to-[#581B94]"
        deltaBgClass="bg-gradient-to-r from-[#4877FF] to-[#581B94] text-white"
      >
        <template #icon>
          <WrenchIcon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Departments"
        value="8"
        delta="+2"
        deltaType="positive"
        iconBgClass="bg-gradient-to-br from-[#fb7185] to-[#f97316]"
        deltaBgClass="bg-gradient-to-r from-[#fb7185] to-[#f97316] text-white"
      >
        <template #icon>
          <BuildingOffice2Icon class="h-4 w-4" />
        </template>
      </KpiCard>

      <KpiCard
        title="Cost/User"
        value="€156"
        delta="-€12"
        deltaType="negative"
        iconBgClass="bg-gradient-to-br from-[#F52C8D] to-[#EE004C]"
        deltaBgClass="bg-gradient-to-r from-[#F52C8D] to-[#EE004C] text-white"
      >
        <template #icon>
          <UsersIcon class="h-4 w-4" />
        </template>
      </KpiCard>
    </section>
  </main>
</template>


