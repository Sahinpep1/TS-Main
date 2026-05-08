"""Trucks API routes."""

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/trucks", tags=["Trucks"])


@router.get("/")
def get_all_trucks():
    """Get all trucks with current load info."""
    from main import data_processor
    return data_processor.get_all_trucks()


@router.get("/capacities")
def get_truck_capacities():
    """Get capacity percentages for all trucks."""
    from main import data_processor
    return data_processor.get_truck_capacities()


@router.get("/{truck_id}")
def get_truck(truck_id: int):
    """Get a single truck by ID."""
    from main import data_processor

    result = data_processor.get_truck_by_id(truck_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Truck not found")
    return result
