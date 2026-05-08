"""Truck management service — assignment logic and validation."""

from services.data_processor import DataProcessor


class TruckManager:
    """Business logic layer for truck assignment operations."""

    def __init__(self, processor: DataProcessor) -> None:
        self.processor = processor

    def assign_delivery(self, coord_id: int, truck_id: int) -> dict:
        """Assign a single delivery coordinate to a truck."""
        coord = self.processor.get_coordinate_by_id(coord_id)
        if coord is None:
            return {"success": False, "error": "Coordinate not found"}

        if coord["status"] == "assigned":
            return {"success": False, "error": "Delivery already assigned"}

        truck = self.processor.get_truck_by_id(truck_id)
        if truck is None:
            return {"success": False, "error": "Truck not found"}

        # Check capacity
        new_weight = truck["current_weight_kg"] + coord["weight_kg"]
        new_volume = truck["current_volume_m3"] + coord["volume_m3"]

        if new_weight > truck["max_weight_kg"]:
            return {
                "success": False,
                "error": f"Weight overflow: {new_weight:.1f}/{truck['max_weight_kg']:.1f} kg",
            }
        if new_volume > truck["max_volume_m3"]:
            return {
                "success": False,
                "error": f"Volume overflow: {new_volume:.2f}/{truck['max_volume_m3']:.2f} m³",
            }

        # Perform assignment
        self.processor.update_coordinate_status(coord_id, "assigned", truck_id)
        self.processor.update_truck_load(truck_id, coord["weight_kg"], coord["volume_m3"], coord_id, add=True)

        return {"success": True, "message": f"Delivery {coord_id} assigned to {truck['name']}"}

    def unassign_delivery(self, coord_id: int) -> dict:
        """Remove a delivery assignment from its truck."""
        coord = self.processor.get_coordinate_by_id(coord_id)
        if coord is None:
            return {"success": False, "error": "Coordinate not found"}

        if coord["status"] != "assigned" or coord["assigned_truck_id"] is None:
            return {"success": False, "error": "Delivery is not assigned"}

        truck_id = coord["assigned_truck_id"]
        self.processor.update_coordinate_status(coord_id, "pending", None)
        self.processor.update_truck_load(truck_id, coord["weight_kg"], coord["volume_m3"], coord_id, add=False)

        return {"success": True, "message": f"Delivery {coord_id} unassigned"}

    def auto_assign_balanced(self) -> dict:
        """Auto-assign all pending deliveries across trucks, balanced by weight."""
        pending = self.processor.get_coordinates_by_status("pending")
        if not pending:
            return {"success": True, "assigned": 0, "message": "No pending deliveries"}

        # Sort pending by priority (high first) then by weight descending
        priority_order = {"high": 0, "medium": 1, "low": 2}
        pending.sort(key=lambda c: (priority_order.get(c["priority"], 2), -c["weight_kg"]))

        assigned_count = 0
        skipped = 0

        for coord in pending:
            # Find the truck with the least current weight that can fit this delivery
            trucks = self.processor.get_all_trucks()
            trucks.sort(key=lambda t: t["current_weight_kg"])

            placed = False
            for truck in trucks:
                can_weight = truck["current_weight_kg"] + coord["weight_kg"] <= truck["max_weight_kg"]
                can_volume = truck["current_volume_m3"] + coord["volume_m3"] <= truck["max_volume_m3"]
                if can_weight and can_volume:
                    result = self.assign_delivery(coord["id"], truck["id"])
                    if result["success"]:
                        assigned_count += 1
                        placed = True
                        break
            if not placed:
                skipped += 1

        return {
            "success": True,
            "assigned": assigned_count,
            "skipped": skipped,
            "message": f"Assigned {assigned_count} deliveries, {skipped} skipped (no capacity)",
        }
