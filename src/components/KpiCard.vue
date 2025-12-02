<script setup>
const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  secondary: { type: String, default: "" },
  delta: { type: String, required: true },
  deltaType: { type: String, default: "positive" }, // 'positive' | 'negative'
  iconBgClass: { type: String, required: true },
  deltaBgClass: { type: String, default: "" },
});
</script>

<template>
  <article
    class="flex min-h-[12rem] flex-col justify-between rounded-2xl border border-[#3d3d3d] bg-[#080808] px-6 py-6 text-xs shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
  >
    <header class="mb-5 flex items-center justify-between gap-3">
      <p
        class="truncate text-base font-normal tracking-wide text-white md:text-lg"
      >
        {{ title }}
      </p>
      <div
        :class="[
          'flex h-8 w-8 items-center justify-center rounded-xl text-white',
          iconBgClass,
        ]"
      >
        <slot name="icon" />
      </div>
    </header>

    <div class="space-y-3">
      <div
        v-if="title === 'Monthly Budget'"
        class="truncate text-2xl font-semibold md:text-3xl"
      >
        <span class="text-white">
          {{ value }}
        </span>
        <span v-if="secondary" class="ml-1 text-[#6A6A6A]">
          {{ secondary }}
        </span>
      </div>

      <p
        v-if="title !== 'Monthly Budget'"
        class="truncate text-2xl font-semibold text-white md:text-3xl"
      >
        {{ value }}
      </p>

      <p
        v-if="secondary && title !== 'Monthly Budget'"
        class="text-base font-normal text-[#e5e5e5]"
      >
        {{ secondary }}
      </p>

      <p
        class="inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium"
        :class="
          deltaBgClass
            ? deltaBgClass
            : deltaType === 'negative'
            ? 'bg-gradient-to-r from-[#fb7185] to-[#f97316] text-white'
            : 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-black'
        "
      >
        <span class="mr-1">
          {{ delta }}
        </span>
      </p>
    </div>
  </article>
</template>
