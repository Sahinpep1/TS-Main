"""FastAPI application entry point for the Logistics Tracker."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.data_processor_copy import DataProcessor
from services.truck_manager import TruckManager
from api.coordinates import router as coordinates_router
from api.trucks import router as trucks_router
from api.assignments import router as assignments_router



# ── Shared service instances ─────────────────────────────────────────────
data_processor = DataProcessor()
truck_manager = TruckManager(data_processor)

# ── FastAPI app ──────────────────────────────────────────────────────────
app = FastAPI(
    title="Logistics Tracker API",
    description="Real-time logistics management with Polars-powered data processing",
    version="1.0.0",
)

# CORS — allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000","http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ────────────────────────────────────────────────────
app.include_router(coordinates_router, prefix="/api")
app.include_router(trucks_router, prefix="/api")
app.include_router(assignments_router, prefix="/api")


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "Logistics Tracker API"}
