"""Pydantic models for the logistics API."""

from pydantic import BaseModel
from typing import Optional


class Coordinate(BaseModel):
    """A delivery point coordinate."""
    id: int
    name: str
    sales_rep: str
    Palet: float
    Miktar: int
    lat: float
    lng: float
    status: str  # "pending", "assigned", "delivered"
    assigned_truck_id: Optional[int] = None


class Truck(BaseModel):
    """A logistics truck."""
    id: int
    Plaka: str
    Driver: str
    Capacity: float
    Miktar: int
    Palet: float
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
