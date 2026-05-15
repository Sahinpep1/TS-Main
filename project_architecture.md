# Project Structure Graph

Here is an updated modular breakdown of your logistics project.

## 🐍 Backend Architecture

The backend handles data processing, automated data fetching, and API endpoints.

```text
backend/
├── main.py                          # Main entry point for the FastAPI application
├── api/                             # API Routers (Endpoints)
│   ├── assignments.py               # Handles truck assignments
│   ├── coordinates.py               # Handles map coordinate data
│   └── trucks.py                    # Handles truck data
├── data/                            # Raw data files and parsing scripts
│   ├── Read_data.py                 # Data reading utilities
│   ├── Read_truck.py                # Truck data reading utilities
│   └── *.xlsx / *.py                # Excel data and specific dataset scripts
├── models/                          # Pydantic data models
│   └── schemas.py                   # Data validation schemas
├── services/                        # Business logic layer
│   ├── data_processor_copy.py       # Core data processing logic
│   └── truck_manager.py             # Truck management logic
└── Data-pulling-Automation/         # Automated data synchronization scripts
    ├── automation.py
    └── rapor_otomasyon_servisi.py
```

## ⚛️ Frontend Architecture

The frontend is a modular React application powered by Vite.

```text
frontend/
├── src/
│   ├── main.tsx & App.tsx           # React entry points
│   ├── api/                         # Frontend API clients
│   ├── components/                  # Reusable UI Components (Map, Sidebar, etc.)
│   ├── hooks/                       # Custom React hooks (useLogistics, useMapFilters)
│   ├── pages/                       # High-level page views (Dashboard, Statistics)
│   └── types/                       # TypeScript interfaces
└── config files                     # vite.config.ts, tailwind.config.js, etc.
```

## 📊 Output & Automation

Recently added directories for reports and automated graph generation.

```text
output/
├── project_overview.md              # Detailed project summary and feature list
└── start_server.md                  # Quick-start commands for backend and frontend

graphify-out/                        # Auto-generated graph data and cache
├── converted/                       # Markdown conversions of data files
└── cache/                           # AST and semantic cache for analysis
```

## 🚀 Server Management

- **Backend:** `uvicorn main:app --reload --port 8000` (runs on http://localhost:8000)
- **Frontend:** `npm run dev` (runs on http://localhost:5173 or 5174)

**Where to look:**
- **To view project status:** Check `output/project_overview.md`.
- **To edit server commands:** Check `output/start_server.md`.
- **To modify logic:** See Backend/Frontend sections above.
