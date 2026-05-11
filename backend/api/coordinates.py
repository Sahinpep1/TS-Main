"""Coordinates API routes."""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

router = APIRouter(prefix="/coordinates", tags=["Coordinates"])


@router.get("/")
def get_all_coordinates(
    status: Optional[str] = Query(None, description="Filter by status"),
):
    """Get all delivery coordinates, optionally filtered."""
    from main import data_processor

    if status:
        return data_processor.get_coordinates_by_status(status)
    return data_processor.get_all_coordinates()


@router.get("/{coord_id}")
def get_coordinate(coord_id: int):
    """Get a single coordinate by ID."""
    from main import data_processor

    result = data_processor.get_coordinate_by_id(coord_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Coordinate not found")
    return result
