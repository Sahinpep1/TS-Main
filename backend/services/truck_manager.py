"""Truck management service — assignment logic and validation."""

from services.data_processor_copy import DataProcessor


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
        new_pallet = truck["Palet"] + coord["Palet"]
        new_volume = truck["Miktar"] + coord["Miktar"]

        if new_pallet > truck["Capacity"]:
            return {
                "success": False,
                "error": f"Weight overflow: {new_pallet:.1f}/{truck['Capacity']:.1f} pallet",
            }

        # Perform assignment
        self.processor.update_coordinate_status(coord_id, "assigned", truck_id)
        self.processor.update_truck_load(truck_id, coord["Palet"], coord["Miktar"], coord_id, add=True)

        return {"success": True, "message": f"Delivery {coord_id} assigned to {truck['Plaka']}"}

    def unassign_delivery(self, coord_id: int) -> dict:
        """Remove a delivery assignment from its truck."""
        coord = self.processor.get_coordinate_by_id(coord_id)
        if coord is None:
            return {"success": False, "error": "Coordinate not found"}

        if coord["status"] != "assigned" or coord["assigned_truck_id"] is None:
            return {"success": False, "error": "Delivery is not assigned"}

        truck_id = coord["assigned_truck_id"]
        self.processor.update_coordinate_status(coord_id, "pending", None)
        self.processor.update_truck_load(truck_id, coord["Palet"], coord["Miktar"], coord_id, add=False)

        return {"success": True, "message": f"Delivery {coord_id} unassigned"}

    def auto_assign_balanced(self) -> dict:
        """Auto-assign all pending deliveries across trucks, balanced by weight."""
        pending = self.processor.get_coordinates_by_status("pending")
        if not pending:
            return {"success": True, "assigned": 0, "message": "No pending deliveries"}



        assigned_count = 0
        skipped = 0

        for coord in pending:
            # Find the truck with the least current weight that can fit this delivery
            trucks = self.processor.get_all_trucks()
            trucks.sort(key=lambda t: t["Palet"])

            placed = False
            for truck in trucks:
                can_weight = truck["Palet"] + coord["Palet"] <= truck["Capacity"]
                can_volume = truck["Miktar"] + coord["Miktar"] <= truck["Miktar"]
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
