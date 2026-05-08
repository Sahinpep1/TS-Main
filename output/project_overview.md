# 🚛 Logistics Tracker — Project Overview

## Running the App

| Service | Command | URL |
|---------|---------|-----|
| **Backend** | `uvicorn main:app --reload --port 8000` (from `backend/`) | http://localhost:8000 |
| **Frontend** | `npm run dev` (from `frontend/`) | http://localhost:5174 |

> [!NOTE]
> Both servers are **currently running**. Open http://localhost:5174 http://localhost:5175 in your browser to see the app.

---

## Project Structure

```
TS-Main/
├── backend/                          # FastAPI + Polars
│   ├── main.py                       # App entry point, CORS, router registration
│   ├── requirements.txt
│   ├── api/                          # ← Separate API folder
│   │   ├── __init__.py
│   │   ├── coordinates.py            # GET /api/coordinates
│   │   ├── trucks.py                 # GET /api/trucks, /api/trucks/capacities
│   │   └── assignments.py            # POST assign/unassign/auto-assign/reset
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py                # Pydantic request/response models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── data_processor.py         # Polars DataFrame queries & mutations
│   │   └── truck_manager.py          # Assignment business logic
│   └── data/
│       ├── __init__.py
│       └── generator.py              # Generates 100 coords + 15 trucks
│
├── frontend/                          # React + TypeScript + Vite
│   └── src/
│       ├── main.tsx                   # Entry point (imports Leaflet CSS)
│       ├── App.tsx                    # Root layout: Sidebar + MapView
│       ├── App.css
│       ├── index.css                  # Global design tokens & reset
│       ├── types/
│       │   └── index.ts              # Shared TypeScript interfaces
│       ├── api/                       # ← Separate API folder
│       │   ├── index.ts              # Barrel export
│       │   ├── coordinatesApi.ts     # Coordinates fetch functions
│       │   ├── trucksApi.ts          # Trucks fetch functions
│       │   └── assignmentsApi.ts     # Assignment operations
│       ├── hooks/
│       │   └── useLogistics.ts       # Central state management hook
│       └── components/
│           ├── Map/
│           │   ├── MapView.tsx       # Leaflet map with 100 markers
│           │   └── MapView.css
│           ├── Sidebar/
│           │   ├── Sidebar.tsx       # Summary stats + truck list
│           │   └── Sidebar.css
│           └── TruckCard/
│               ├── TruckCard.tsx     # Individual truck with capacity bars
│               └── TruckCard.css
```

---

## Features

### Backend (FastAPI + Polars)
- **100 delivery coordinates** scattered across 15 Turkish cities (weighted distribution)
- **15 trucks** with realistic plate numbers and varying capacities (8t–20t)
- **Polars DataFrames** for in-memory data processing and analytics
- **Balanced auto-assignment** algorithm (priority-first, least-loaded truck)
- API docs at http://localhost:8000/docs

### Frontend (React + TypeScript)
- **Leaflet dark map** (CartoDB dark tiles) with color-coded markers by priority
- **Sidebar** with summary stats (total/assigned/pending/weight)
- **15 TruckCards** with animated capacity bars (weight % and volume %)
- **Click-to-assign**: Select a truck → click a map marker → assign delivery
- **Auto Assign** button for one-click balanced distribution
- **Reset** to return to initial state

### Key Interactions
1. **Select a truck** in the sidebar (highlights with glow)
2. **Click a map marker** → popup shows delivery details + "Assign" button
3. **⚡ Auto Assign** distributes all pending deliveries automatically
4. **↻ Reset** clears all assignments

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coordinates` | All 100 coordinates (filter: `?status=`, `?priority=`) |
| GET | `/api/coordinates/{id}` | Single coordinate |
| GET | `/api/trucks` | All 15 trucks with current load |
| GET | `/api/trucks/capacities` | Capacity percentages |
| GET | `/api/trucks/{id}` | Single truck |
| POST | `/api/assignments/assign` | Assign delivery to truck |
| POST | `/api/assignments/unassign/{id}` | Remove assignment |
| POST | `/api/assignments/auto-assign` | Auto-assign all pending |
| POST | `/api/assignments/reset` | Reset all data |
| GET | `/api/assignments/summary` | Logistics summary stats |
