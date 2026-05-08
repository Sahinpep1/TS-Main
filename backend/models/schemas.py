"""Pydantic models for the logistics API."""

from pydantic import BaseModel
from typing import Optional


class Coordinate(BaseModel):
    """A delivery point coordinate."""
    id: int
    lat: float
    lng: float
    label: str
    weight_kg: float
    volume_m3: float
    priority: str  # "high", "medium", "low"
    status: str  # "pending", "assigned", "delivered"
    assigned_truck_id: Optional[int] = None


class Truck(BaseModel):
    """A logistics truck."""
    id: int
    name: str
    plate: str
    max_weight_kg: float
    max_volume_m3: float
    current_weight_kg: float = 0.0
    current_volume_m3: float = 0.0
    assigned_deliveries: list[int] = []
    color: str = "#3b82f6"
    status: str  # "idle", "loading", "en_route", "returning"


class AssignRequest(BaseModel):
    """Request to assign a delivery to a truck."""
    coordinate_id: int
    truck_id: int


class BulkAssignRequest(BaseModel):
    """Request to auto-assign all pending deliveries."""
    strategy: str = "balanced"  # "balanced", "nearest", "priority"


class TruckCapacity(BaseModel):
    """Truck capacity summary."""
    truck_id: int
    name: str
    weight_percent: float
    volume_percent: float
    delivery_count: int


class LogisticsSummary(BaseModel):
    """Overall logistics summary."""
    total_deliveries: int
    assigned_deliveries: int
    pending_deliveries: int
    total_weight_kg: float
    total_volume_m3: float
    trucks_active: int
    trucks_idle: int
