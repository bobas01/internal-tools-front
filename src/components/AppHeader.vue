<script setup>
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
  BoltIcon,
  MagnifyingGlassIcon,
  SunIcon,
  BellIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const route = useRoute();

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Tools", path: "/tools" },
  { label: "Analytics", path: "/analytics" },
  { label: "Settings", path: "/settings" },
];
const isSearchOpen = ref(false);
const isNavOpen = ref(false);
const isUserMenuOpen = ref(false);
const notificationsCount = ref(3);
</script>

<template>
  <header
    class="relative flex flex-col gap-3 border-b border-[#151515] bg-[#080808] px-4 py-3 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16"
  >
    <div class="flex items-center gap-3 md:gap-8">
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4877FF] to-[#581B94] text-white shadow-md"
        >
          <BoltIcon class="h-5 w-5 text-white" />
        </div>
        <span class="text-xl font-semibold tracking-tight text-white">
          TechCorp
        </span>
      </div>

      <nav class="hidden items-center gap-6 text-xs text-[#9c9c9c] md:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="inline-flex items-center text-sm font-medium transition-colors hover:text-white"
          :class="route.path === item.path ? 'text-white' : ''"
        >
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <button
        class="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-[#9c9c9c] md:hidden"
        type="button"
        :aria-expanded="isNavOpen"
        :aria-label="isNavOpen ? 'Close navigation' : 'Open navigation'"
        @click="isNavOpen = !isNavOpen"
      >
        <Bars3Icon v-if="!isNavOpen" class="h-5 w-5" />
        <XMarkIcon v-else class="h-5 w-5" />
      </button>
    </div>

    <div
      class="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end md:gap-8"
    >
      <div
        class="hidden min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#151515] px-3 py-1.5 text-xs text-[#9c9c9c] border border-[#252525] min-[400px]:flex min-[400px]:min-w-[260px] md:flex-none"
      >
        <MagnifyingGlassIcon class="h-4 w-4 text-[#9c9c9c]" />
        <input
          type="text"
          placeholder="Search tools..."
          class="w-full bg-transparent text-xs text-[#9c9c9c] placeholder-[#9c9c9c] outline-none"
        />
      </div>

      <button
        class="hidden h-8 w-8 items-center justify-center rounded-md bg-[#151515] text-[#9c9c9c] border border-[#252525] max-[399px]:flex"
        type="button"
        @click="isSearchOpen = true"
        aria-label="Search tools"
      >
        <MagnifyingGlassIcon class="h-4 w-4" />
      </button>

      <div class="flex flex-shrink-0 items-center gap-4 text-xs md:gap-5">
        <button class="text-[#f0b100]">
          <SunIcon class="h-5 w-5" />
        </button>

        <button class="relative text-[#9c9c9c]">
          <BellIcon class="h-5 w-5" />
          <span
            v-if="notificationsCount > 0"
            class="absolute -right-1 -top-1 flex h-3.5 min-w-[0.9rem] items-center justify-center rounded-full bg-rose-500 px-[3px] text-[0.6rem] font-semibold text-white"
          >
            {{ notificationsCount }}
          </span>
        </button>

        <button class="text-[#9c9c9c]">
          <Cog6ToothIcon class="h-5 w-5" />
        </button>

        <div class="relative">
          <button
            class="flex items-center gap-2"
            type="button"
            :aria-expanded="isUserMenuOpen"
            @click="isUserMenuOpen = !isUserMenuOpen"
          >
            <span
              class="flex h-7 w-7 items-center justify-center rounded-full bg-white"
            />
            <ChevronDownIcon class="h-4 w-4 text-[#9c9c9c]" />
          </button>

          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 z-30 mt-2 w-40 rounded-md border border-[#262626] bg-[#050505] py-1 text-xs text-[#e5e5e5] shadow-lg"
          >
            <div class="px-3 py-2 text-[0.7rem] text-[#9c9c9c]">
              Compte utilisateur
            </div>
            <button
              class="flex w-full items-center px-3 py-1.5 text-left hover:bg-[#111111]"
              type="button"
            >
              Informations personnelles
            </button>
            <button
              class="mt-1 flex w-full items-center px-3 py-1.5 text-left text-rose-400 hover:bg-[#111111]"
              type="button"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav
      v-if="isNavOpen"
      class="mt-1 flex flex-col gap-1 text-xs text-[#9c9c9c] md:hidden"
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center rounded-md px-2 py-1.5 text-left hover:bg-[#111111]"
        :class="route.path === item.path ? 'text-white' : ''"
        @click="isNavOpen = false"
      >
        <span>
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>

    <div
      v-if="isSearchOpen"
      class="absolute inset-x-0 top-full z-20 flex justify-center pt-2 max-[399px]:flex md:hidden"
    >
      <div
        class="flex w-[80%] max-w-md items-center gap-2 rounded-lg bg-[#151515] px-3 py-1.5 text-xs text-[#9c9c9c] border border-[#252525]"
      >
        <MagnifyingGlassIcon class="h-4 w-4 text-[#9c9c9c]" />
        <input
          type="text"
          placeholder="Search tools..."
          class="w-full bg-transparent text-xs text-[#9c9c9c] placeholder-[#9c9c9c] outline-none"
        />
        <button
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-md text-[#9c9c9c]"
          @click="isSearchOpen = false"
          aria-label="Close search"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
</template>
