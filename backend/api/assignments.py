"""Assignment API routes — assign/unassign deliveries to trucks."""

from fastapi import APIRouter
from models.schemas import AssignRequest

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.post("/assign")
def assign_delivery(req: AssignRequest):
    """Assign a delivery to a truck."""
    from main import truck_manager
    return truck_manager.assign_delivery(req.coordinate_id, req.truck_id)


@router.post("/unassign/{coord_id}")
def unassign_delivery(coord_id: int):
    """Remove a delivery assignment."""
    from main import truck_manager
    return truck_manager.unassign_delivery(coord_id)


@router.post("/auto-assign")
def auto_assign():
    """Auto-assign all pending deliveries (balanced strategy)."""
    from main import truck_manager
    return truck_manager.auto_assign_balanced()


@router.post("/reset")
def reset_all():
    """Reset all data to initial state."""
    from main import data_processor
    data_processor.reset_all()
    return {"success": True, "message": "All data reset"}


@router.get("/summary")
def get_summary():
    """Get overall logistics summary."""
    from main import data_processor
    return data_processor.get_summary()
