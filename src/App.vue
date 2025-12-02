<script setup>
const navItems = [
  { label: "Dashboard", active: true },
  { label: "Tools", active: false },
  { label: "Analytics", active: false },
];
</script>

<template>
  <div class="min-h-screen bg-slate-950/90 text-slate-50">
    <!-- Gradient halo -->
    <div
      class="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-br from-violet-500/40 via-sky-500/20 to-fuchsia-500/40 blur-3xl"
    ></div>

    <!-- Page container -->
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-8 flex items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 shadow-lg shadow-violet-500/30"
          >
            <span class="text-lg font-semibold tracking-tight">IT</span>
          </div>
          <div>
            <h1 class="text-base font-semibold text-slate-50 sm:text-lg">
              Internal Tools Dashboard
            </h1>
            <p class="text-xs text-slate-400 sm:text-sm">
              Monitoring centralisé de vos outils SaaS
            </p>
          </div>
        </div>

        <!-- Right side header -->
        <div class="flex items-center gap-3">
          <nav class="hidden items-center gap-1 rounded-full bg-slate-900/70 p-1 text-xs sm:flex">
            <button
              v-for="item in navItems"
              :key="item.label"
              class="rounded-full px-3 py-1.5 transition-colors"
              :class="
                item.active
                  ? 'bg-slate-100 text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/80'
              "
            >
              {{ item.label }}
            </button>
          </nav>
          <button
            class="hidden items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm hover:border-slate-500/80 hover:bg-slate-900 sm:flex"
          >
            <span class="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>En ligne</span>
          </button>
        </div>
      </header>

      <!-- Main content -->
      <main class="flex flex-1 flex-col gap-8">
        <!-- Top section: title + filters -->
        <section class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 class="text-lg font-semibold text-slate-50 sm:text-xl">
              Vue d’ensemble
            </h2>
            <p class="mt-1 text-sm text-slate-400">
              Statut temps réel de vos intégrations critiques.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              class="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-500/80"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>24h</span>
            </button>
            <button
              class="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-white"
            >
              Actualiser
            </button>
          </div>
        </section>

        <!-- KPIs grid -->
        <section class="grid gap-4 md:grid-cols-3">
          <article
            class="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm shadow-slate-900/70"
          >
            <div
              class="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-500/10"
            ></div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
              Outils actifs
            </p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-semibold text-slate-50">18</span>
              <span class="text-xs text-emerald-400">+3 cette semaine</span>
            </div>
            <p class="mt-3 text-xs text-slate-400">
              Nombre total d’outils connectés et opérationnels.
            </p>
          </article>

          <article
            class="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm shadow-slate-900/70"
          >
            <div
              class="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-amber-500/10"
            ></div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
              Incidents ouverts
            </p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-semibold text-slate-50">2</span>
              <span class="text-xs text-amber-400">1 critique</span>
            </div>
            <p class="mt-3 text-xs text-slate-400">
              Intégrations nécessitant une attention immédiate.
            </p>
          </article>

          <article
            class="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-sm shadow-slate-900/70"
          >
            <div
              class="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-sky-500/10"
            ></div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
              Uptime moyen 30j
            </p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-2xl font-semibold text-slate-50">99,4%</span>
              <span class="text-xs text-emerald-400">+0,3%</span>
            </div>
            <p class="mt-3 text-xs text-slate-400">
              Basé sur les principaux outils SaaS monitorés.
            </p>
          </article>
        </section>

        <!-- Recent tools + side column -->
        <section class="grid gap-4 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <!-- Recent tools -->
          <article
            class="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 shadow-sm shadow-slate-900/70"
          >
            <header class="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-50">
                  Outils récents
                </h3>
                <p class="text-xs text-slate-400">
                  Dernières mises à jour de connecteurs.
                </p>
              </div>
              <button
                class="hidden rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-200 hover:border-slate-500/80 sm:inline-flex"
              >
                Voir tous
              </button>
            </header>

            <div class="divide-y divide-slate-800/80">
              <div class="grid grid-cols-[minmax(0,2fr),minmax(0,1fr),auto] gap-3 px-4 py-3 text-xs text-slate-400">
                <span>Outil</span>
                <span class="hidden sm:inline">Dernière synchro</span>
                <span class="text-right">Statut</span>
              </div>

              <div class="px-4 py-3 text-xs sm:text-sm">
                <div class="flex items-center justify-between gap-3 py-2">
                  <div class="min-w-0">
                    <p class="truncate font-medium text-slate-100">
                      Notion
                    </p>
                    <p class="truncate text-xs text-slate-400">
                      Base documentation interne
                    </p>
                  </div>
                  <p class="hidden text-xs text-slate-300 sm:block">
                    Il y a 12 min
                  </p>
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    Actif
                  </span>
                </div>

                <div class="flex items-center justify-between gap-3 py-2">
                  <div class="min-w-0">
                    <p class="truncate font-medium text-slate-100">
                      Jira
                    </p>
                    <p class="truncate text-xs text-slate-400">
                      Tickets incidents IT
                    </p>
                  </div>
                  <p class="hidden text-xs text-slate-300 sm:block">
                    Il y a 37 min
                  </p>
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                    Dégradé
                  </span>
                </div>

                <div class="flex items-center justify-between gap-3 py-2">
                  <div class="min-w-0">
                    <p class="truncate font-medium text-slate-100">
                      Slack
                    </p>
                    <p class="truncate text-xs text-slate-400">
                      Alerting incidents + notifications
                    </p>
                  </div>
                  <p class="hidden text-xs text-slate-300 sm:block">
                    Il y a 2 h
                  </p>
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-300"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                    Incident
                  </span>
                </div>
              </div>
            </div>
          </article>

          <!-- Side column: status + shortcuts -->
          <aside class="flex flex-col gap-4">
            <article
              class="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-sm shadow-slate-900/70"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-slate-50">
                    Santé globale
                  </h3>
                  <p class="mt-1 text-xs text-slate-400">
                    Basé sur les derniers checks d’intégration.
                  </p>
                </div>
                <div
                  class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1"
                >
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span class="text-xs font-medium text-emerald-200">
                    Stable
                  </span>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-300">
                <div class="rounded-xl bg-slate-900/90 px-3 py-2">
                  <p class="text-[0.65rem] uppercase tracking-wide text-slate-500">
                    Ok
                  </p>
                  <p class="mt-1 text-sm font-semibold text-emerald-300">
                    14
                  </p>
                </div>
                <div class="rounded-xl bg-slate-900/90 px-3 py-2">
                  <p class="text-[0.65rem] uppercase tracking-wide text-slate-500">
                    Dégradé
                  </p>
                  <p class="mt-1 text-sm font-semibold text-amber-300">
                    3
                  </p>
                </div>
                <div class="rounded-xl bg-slate-900/90 px-3 py-2">
                  <p class="text-[0.65rem] uppercase tracking-wide text-slate-500">
                    Incident
                  </p>
                  <p class="mt-1 text-sm font-semibold text-rose-300">
                    1
                  </p>
                </div>
              </div>
            </article>

            <article
              class="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 text-xs text-slate-300 shadow-sm shadow-slate-900/70"
            >
              <h3 class="text-sm font-semibold text-slate-50">
                Raccourcis rapides
              </h3>
              <p class="mt-1 text-xs text-slate-400">
                Actions fréquentes pour l’admin IT.
              </p>

              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  class="rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-xs hover:border-slate-500/80"
                >
                  Ajouter un outil
                </button>
                <button
                  class="rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-xs hover:border-slate-500/80"
                >
                  Voir incidents
                </button>
                <button
                  class="rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-xs hover:border-slate-500/80"
                >
                  Gérer accès
                </button>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  </div>
</template>
