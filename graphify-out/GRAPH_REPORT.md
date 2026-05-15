# Graph Report - TS-Main  (2026-05-15)

## Corpus Check
- 79 files · ~959,909 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 481 nodes · 772 edges · 36 communities (29 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c931e32d`
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
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]

## God Nodes (most connected - your core abstractions)
1. `DataProcessor` - 28 edges
2. `Coordinate` - 22 edges
3. `Truck` - 22 edges
4. `dependencies` - 20 edges
5. `compilerOptions` - 20 edges
6. `compilerOptions` - 18 edges
7. `devDependencies` - 17 edges
8. `compilerOptions` - 16 edges
9. `cn()` - 15 edges
10. `LogisticsSummary` - 15 edges

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

## Communities (36 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (37): fetchCoordinateById(), fetchCoordinates(), fetchCoordinatesByStatus(), Coordinates API, DashboardPage(), DashboardPageProps, CARDS, KpiCards() (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (33): assign_delivery(), auto_assign(), Assignment API routes — assign/unassign deliveries to trucks., Assign a delivery to a truck., Remove a delivery assignment., Auto-assign all pending deliveries (balanced strategy)., Reset all data to initial state., reset_all() (+25 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (32): get_summary(), Get overall logistics summary., get_all_coordinates(), get_ambalaj(), get_coordinate(), get_sale_rep_list(), get_st_bazli(), Coordinates API routes. (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (22): AutomationWorker, range, dagitici_toplam_sutunu_dahil_etme, gunluk_veri_araligi, kasa_acik_sutun_araligi, toplam_arama_araligi_satir, toplam_veri_araligi, RaporOtomasyonServisi (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (15): AppNav(), AppNavProps, AppPage, useDebounce(), ALL_SALE_REPS, ALL_STATUSES, createDefaultFilters(), useMapFilters() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (24): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (17): isPointInPolygon(), MapLassoControl(), MapLassoControlProps, DEFAULT_ITEMS, LegendItem, MapLegend(), MapLegendProps, ColorMode (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (29): dependencies, axios, class-variance-authority, clsx, @fontsource-variable/geist, @geoman-io/leaflet-geoman-free, leaflet, leaflet.heat (+21 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (19): cn(), MapFilterBar(), MapFilterBarProps, STATUS_OPTIONS, MultiSelect(), MultiSelectProps, Option, NativeSelect() (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (16): API Endpoints, Backend (FastAPI + Polars), code:block1 (TS-Main/), Features, Frontend (React + TypeScript), Key Interactions, 🚛 Logistics Tracker — Project Overview, Project Structure (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (13): credentials, password, username, locations, gunluk, para, toplam, settings (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (6): Sheet: Sheet1, Sheet: Sheet1, Sheet: Sheet1, Sheet: Sheet1, Sheet: Sheet1, Sheet: Sheet1

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (5): code:js (export default defineConfig([), code:js (// eslint.config.js), Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (3): FastAPI application entry point for the Logistics Tracker., Health check endpoint., root()

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (3): Pydantic Schemas, Data Processor Service, Pending Orders Data

### Community 31 - "Community 31"
Cohesion: 0.16
Nodes (18): fetchTruckById(), fetchTruckCapacities(), fetchTrucks(), Trucks API, Main Entry Point, BaseModel, AssignRequest, BulkAssignRequest (+10 more)

### Community 32 - "Community 32"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+8 more)

## Knowledge Gaps
- **174 isolated node(s):** `FastAPI application entry point for the Logistics Tracker.`, `Health check endpoint.`, `Assignment API routes — assign/unassign deliveries to trucks.`, `Assign a delivery to a truck.`, `Remove a delivery assignment.` (+169 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DataProcessor` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `range` connect `Community 3` to `Community 12`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Why does `Assignments API` connect `Community 1` to `Community 0`, `Community 31`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `DataProcessor` (e.g. with `TruckManager` and `truck_manager.py`) actually correct?**
  _`DataProcessor` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `FastAPI application entry point for the Logistics Tracker.`, `Health check endpoint.`, `Assignment API routes — assign/unassign deliveries to trucks.` to the rest of the system?**
  _174 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._