# Graph Report - TS-Main  (2026-05-15)

## Corpus Check
- 80 files · ~886,600 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 421 nodes · 559 edges · 39 communities (27 shown, 12 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e9e9100f`
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
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]

## God Nodes (most connected - your core abstractions)
1. `DataProcessor` - 31 edges
2. `dependencies` - 20 edges
3. `compilerOptions` - 20 edges
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

## Communities (39 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (55): fetchTruckCapacities(), fetchTrucks(), Assignments API, Coordinates API, Trucks API, Main Entry Point, Pydantic Schemas, Data Processor Service (+47 more)

### Community 1 - "Community 1"
Cohesion: 0.2
Nodes (9): get_ambalaj(), get_coordinate(), get_st_bazli(), Coordinates API routes., Get all ambalajs as list of dicts., Get all st bazli as list of dicts., Get a single coordinate by ID., Return a single coordinate by ID. (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (19): range, dagitici_toplam_sutunu_dahil_etme, gunluk_veri_araligi, kasa_acik_sutun_araligi, toplam_arama_araligi_satir, toplam_veri_araligi, Belirtilen Telerik alanına metni Playwright ile girer ve          Telerik'in Cl, Belirtilen kimlik bilgileriyle giriş yapmayı dener ve ana menünün görünmesini do (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (29): dependencies, axios, class-variance-authority, clsx, @fontsource-variable/geist, @geoman-io/leaflet-geoman-free, leaflet, leaflet.heat (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (26): assign_delivery(), auto_assign(), get_summary(), Assignment API routes — assign/unassign deliveries to trucks., Assign a delivery to a truck., Remove a delivery assignment., Auto-assign all pending deliveries (balanced strategy)., Reset all data to initial state. (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (20): AppNav(), AppNavProps, AppPage, useDebounce(), ALL_SALE_REPS, ALL_STATUSES, useMapFilters(), useMultiSelect() (+12 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (20): allowImportingTsExtensions, erasableSyntaxOnly, jsx, module, moduleDetection, moduleResolution, noEmit, noFallthroughCasesInSwitch (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.1
Nodes (15): MapHeatmapLayer(), MapLassoControl(), DEFAULT_ITEMS, LegendItem, MapLegend(), MapLegendProps, ColorMode, MapMarker() (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (16): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.23
Nodes (11): cn(), NativeSelect(), NativeSelectProps, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (16): FastAPI application entry point for the Logistics Tracker., Health check endpoint., root(), API Endpoints, Backend (FastAPI + Polars), code:block1 (TS-Main/), Features, Frontend (React + TypeScript) (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): credentials, password, username, locations, gunluk, para, toplam, settings (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): code:js (export default defineConfig([), code:js (// eslint.config.js), Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (8): DataProcessor, Holds in-memory Polars DataFrames and provides query helpers., Holds in-memory Polars DataFrames and provides query helpers., Reset all data to initial state., Return a single coordinate by ID., Return all ambalajs as list of dicts., Return all st bazli as list of dicts., Return all trucks as list of dicts, parsing assigned_deliveries.

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (7): get_all_trucks(), get_truck(), get_truck_capacities(), Get all trucks with current load info., Get capacity percentages for all trucks., Get a single truck by ID., Return all trucks as list of dicts, parsing assigned_deliveries.

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (4): Add or remove a delivery's load from a truck., Return a single truck by ID., Return a single truck by ID., Add or remove a delivery's load from a truck.

### Community 33 - "Community 33"
Cohesion: 0.4
Nodes (5): get_all_coordinates(), get_sale_rep_list(), Get all delivery coordinates, optionally filtered., Return all coordinates as list of dicts., Return a list of unique sales representatives.

## Knowledge Gaps
- **202 isolated node(s):** `Holds in-memory Polars DataFrames and provides query helpers.`, `Return all coordinates as list of dicts.`, `Return a single coordinate by ID.`, `Return coordinates filtered by status.`, `Return coordinates filtered by status.` (+197 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DataProcessor` connect `Community 16` to `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 4`, `Community 1`, `Community 13`, `Community 31`?**
  _High betweenness centrality (0.328) - this node is a cross-community bridge._
- **Why does `range` connect `Community 2` to `Community 12`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **Why does `NativeSelect()` connect `Community 10` to `Community 5`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `DataProcessor` (e.g. with `TruckManager` and `truck_manager.py`) actually correct?**
  _`DataProcessor` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Holds in-memory Polars DataFrames and provides query helpers.`, `Return all coordinates as list of dicts.`, `Return a single coordinate by ID.` to the rest of the system?**
  _202 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._