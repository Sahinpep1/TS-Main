# Graph Report - TS-Main  (2026-05-15)

## Corpus Check
- 80 files · ~960,697 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 388 nodes · 516 edges · 32 communities (24 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26f02e04`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `dependencies` - 20 edges
2. `compilerOptions` - 20 edges
3. `DataProcessor` - 17 edges
4. `devDependencies` - 16 edges
5. `Truck` - 15 edges
6. `Coordinate` - 14 edges
7. `useMapFilters()` - 12 edges
8. `cn()` - 12 edges
9. `Assignments API` - 12 edges
10. `Coordinates API` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Data Processor Service` --references--> `Pending Orders Data`  [INFERRED]
  backend/services/data_processor_copy.py → graphify-out/converted/Bekleyen_Siparisler_c4a7feba.md
- `Truck Manager Service` --references--> `Trucks Inventory`  [INFERRED]
  backend/services/truck_manager.py → graphify-out/converted/trucks_ed6e51a3.md
- `A delivery point coordinate.` --rationale_for--> `Coordinate`  [EXTRACTED]
  backend/models/schemas.py → frontend/src/types/index.ts
- `Truck capacity summary.` --rationale_for--> `TruckCapacity`  [EXTRACTED]
  backend/models/schemas.py → frontend/src/types/index.ts
- `Overall logistics summary.` --rationale_for--> `LogisticsSummary`  [EXTRACTED]
  backend/models/schemas.py → frontend/src/types/index.ts

## Communities (32 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (52): fetchTruckCapacities(), fetchTrucks(), Trucks API, Main Entry Point, BaseModel, DashboardPage(), DashboardPageProps, CARDS (+44 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (26): get_summary(), Get overall logistics summary., get_all_coordinates(), get_ambalaj(), get_coordinate(), get_sale_rep_list(), get_st_bazli(), Coordinates API routes. (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (20): AutomationWorker, range, dagitici_toplam_sutunu_dahil_etme, gunluk_veri_araligi, kasa_acik_sutun_araligi, toplam_arama_araligi_satir, toplam_veri_araligi, Belirtilen Telerik alanına metni Playwright ile girer ve          Telerik'in Cl (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (29): dependencies, axios, class-variance-authority, clsx, @fontsource-variable/geist, @geoman-io/leaflet-geoman-free, leaflet, leaflet.heat (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.1
Nodes (21): assign_delivery(), auto_assign(), Assignment API routes — assign/unassign deliveries to trucks., Assign a delivery to a truck., Remove a delivery assignment., Auto-assign all pending deliveries (balanced strategy)., Reset all data to initial state., reset_all() (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (19): AppNav(), AppNavProps, AppPage, useDebounce(), ALL_SALE_REPS, ALL_STATUSES, useMapFilters(), useMultiSelect() (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (20): allowImportingTsExtensions, erasableSyntaxOnly, jsx, module, moduleDetection, moduleResolution, noEmit, noFallthroughCasesInSwitch (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (4): DEFAULT_ITEMS, LegendItem, MapLegend(), MapLegendProps

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (16): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.23
Nodes (11): cn(), NativeSelect(), NativeSelectProps, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (23): get_all_trucks(), get_truck(), get_truck_capacities(), Get all trucks with current load info., Get capacity percentages for all trucks., Get a single truck by ID., FastAPI application entry point for the Logistics Tracker., Health check endpoint. (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): credentials, password, username, locations, gunluk, para, toplam, settings (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (7): Palet_Acıklama(), Palet Ürün Açıklaması hesaplama fonksiyonu, Konumlar hesaplama fonksiyonu, Palet_Hesaplama(), Palet sayısı hesaplama fonksiyonu, read_data(), Polars-based data processing service for logistics data.

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): code:js (export default defineConfig([), code:js (// eslint.config.js), Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **191 isolated node(s):** `StatisticsPageProps`, `FastAPI application entry point for the Logistics Tracker.`, `Health check endpoint.`, `Assignment API routes — assign/unassign deliveries to trucks.`, `Assign a delivery to a truck.` (+186 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DataProcessor` connect `Community 1` to `Community 11`, `Community 4`, `Community 13`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Why does `range` connect `Community 2` to `Community 12`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Why does `NativeSelect()` connect `Community 10` to `Community 5`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **What connects `StatisticsPageProps`, `FastAPI application entry point for the Logistics Tracker.`, `Health check endpoint.` to the rest of the system?**
  _191 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._