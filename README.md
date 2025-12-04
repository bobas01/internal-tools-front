# Internal Tools Management Dashboard

Application de gestion et d'analyse des outils internes avec un thème sombre moderne et des dégradés colorés.

## 🚀 Technologies

- **Vue.js 3** (Composition API)
- **Vue Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Chart.js** & **vue-chart-3** pour les graphiques
- **jsPDF** & **jspdf-autotable** pour l'export PDF
- **Heroicons** pour les icônes
- **Vite** comme build tool

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 🎯 Fonctionnalités

### Dashboard (`/dashboard`)

- **KPIs** : Budget, Outils actifs, Départements, Coût par utilisateur
- **Tableau des outils récents** avec pagination, filtrage et tri
- **Barre de progression budgétaire**

### Tools (`/tools`)

- **Catalogue complet** des outils avec filtres avancés
- **CRUD complet** : Création, modification, suppression d'outils
- **Filtres** : Par département, statut, catégorie, plage de coût
- **Recherche globale** intégrée
- **Pagination** (10 outils par page)
- **Modales** pour les détails, création et édition

### Analytics (`/analytics`)

- **Cost Analytics** :
  - Évolution des dépenses mensuelles (graphique linéaire)
  - Répartition des coûts par département (graphique donut)
  - Coûts par département et catégorie (barres horizontales)
  - Top 10 des outils les plus coûteux
- **Usage Analytics** :

  - Taux d'adoption des utilisateurs
  - Outils les plus/moins utilisés
  - Activité par département
  - Tendances de croissance (nouveaux outils)
  - Filtres par période (30j, 90j, 1an) et département

- **Insights & Alerts** :

  - Alertes d'optimisation des coûts
  - Avertissements sur les outils inutilisés
  - Métriques ROI et adoption

- **Export** :
  - Export CSV des données
  - Export PDF avec rapport complet formaté

### Settings (`/settings`)

- Page de paramètres (à implémenter)

## 🎨 Design System

- **Thème** : Sombre avec fond `#050505` / `#060606`
- **Couleurs principales** :
  - Bleu : `#4877FF` → `#581B94`
  - Vert : `#22c55e` → `#16a34a`
  - Orange : `#f97316` → `#FB7185`
  - Rose : `#F52C8D` → `#EE004C`
- **Bordures** : `#262626`
- **Textes** : Blanc `#e5e5e5` / Gris `#9ca3af`

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── AppHeader.vue   # En-tête avec navigation
│   ├── KpiCard.vue     # Carte KPI
│   ├── BaseLineChart.vue
│   ├── BaseDonutChart.vue
│   ├── RecentToolsTable.vue
│   ├── ToolsTable.vue
│   ├── ToolCreateModal.vue
│   ├── ToolEditModal.vue
│   └── ToolDetailsModal.vue
├── pages/              # Pages de l'application
│   ├── DashboardPage.vue
│   ├── ToolsPage.vue
│   ├── AnalyticsPage.vue
│   └── SettingsPage.vue
├── hooks/              # Hooks Vue personnalisés
│   ├── useTools.js     # Gestion des outils
│   ├── useAnalytics.js # Données analytics
│   └── useGlobalSearch.js # Recherche globale
├── router.js           # Configuration du routing
└── App.vue            # Composant racine
```

## 🔌 API Backend

L'application se connecte à :

- **Tools API** : `https://tt-jsonserver-01.alt-tools.tech/tools`
- **Analytics API** : `https://tt-jsonserver-01.alt-tools.tech/analytics`

## ✨ Fonctionnalités avancées

- **Recherche globale** : Recherche unifiée depuis le header
- **Filtrage multi-critères** : Combinaison de plusieurs filtres
- **Tri interactif** : Tri par colonnes avec indicateurs visuels
- **Graphiques interactifs** : Tooltips enrichis, animations
- **Responsive design** : Adapté mobile, tablette et desktop
- **Export de données** : CSV et PDF avec formatage

## 🛠️ Développement

### Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile pour la production
- `npm run preview` : Prévisualise le build de production

### Configuration

Le projet utilise Vite avec le plugin Vue. La configuration se trouve dans `vite.config.js`.

## 📝 Notes

- Les données sont normalisées côté client (conversion des strings en nombres)
- Les exports PDF formatent les nombres avec des espaces (format français)
- Les graphiques Chart.js sont configurés avec un thème sombre
- Le design est entièrement responsive avec Tailwind CSS
