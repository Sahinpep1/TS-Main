"""Polars-based data processing service for logistics data."""

import json
import polars as pl
#from data.generator import generate_coordinates, generate_trucks
from data.Read_data import read_data
from data.Read_truck import read_trucks

class DataProcessor:
    """Holds in-memory Polars DataFrames and provides query helpers."""

    def __init__(self) -> None:
        birlesik_df, palet_ve_konumlar = read_data()
        self.coordinates_df: pl.DataFrame = palet_ve_konumlar
        self.orders_df: pl.DataFrame = birlesik_df
        self.trucks_df: pl.DataFrame = read_trucks()

    # ── Coordinates ──────────────────────────────────────────────────────

    def get_all_coordinates(self) -> list[dict]:
        """Return all coordinates as list of dicts."""
        return self.coordinates_df.to_dicts()

    def get_coordinate_by_id(self, coord_id: int) -> dict | None:
        """Return a single coordinate by ID."""
        filtered = self.coordinates_df.filter(pl.col("id") == coord_id)
        if filtered.height == 0:
            return None
        return filtered.to_dicts()[0]

    def get_coordinates_by_status(self, status: str) -> list[dict]:
        """Return coordinates filtered by status."""
        return (
            self.coordinates_df
            .filter(pl.col("status") == status)
            .to_dicts()
        )

   

    def update_coordinate_status(
        self, coord_id: int, status: str, truck_id: int | None = None
    ) -> bool:
        """Update the status and optionally the assigned truck of a coordinate."""
        mask = self.coordinates_df["id"] == coord_id
        if mask.sum() == 0:
            return False
        self.coordinates_df = self.coordinates_df.with_columns(
            pl.when(mask).then(pl.lit(status)).otherwise(pl.col("status")).alias("status"),
            pl.when(mask).then(pl.lit(truck_id)).otherwise(pl.col("assigned_truck_id")).alias("assigned_truck_id"),
        )
        return True

    # ── Trucks ───────────────────────────────────────────────────────────

    def get_all_trucks(self) -> list[dict]:
        """Return all trucks as list of dicts, parsing assigned_deliveries."""
        rows = self.trucks_df.to_dicts()
        for row in rows:
            if isinstance(row["assigned_deliveries"], str):
                row["assigned_deliveries"] = json.loads(row["assigned_deliveries"])
        return rows

    def get_truck_by_id(self, truck_id: int) -> dict | None:
        """Return a single truck by ID."""
        filtered = self.trucks_df.filter(pl.col("id") == truck_id)
        if filtered.height == 0:
            return None
        row = filtered.to_dicts()[0]
        if isinstance(row["assigned_deliveries"], str):
            row["assigned_deliveries"] = json.loads(row["assigned_deliveries"])
        return row

    def update_truck_load(
        self,
        truck_id: int,
        Miktar: float,
        volume_delta: float,
        delivery_id: int,
        add: bool = True,
    ) -> bool:
        """Add or remove a delivery's load from a truck."""
        truck = self.get_truck_by_id(truck_id)
        if truck is None:
            return False

        deliveries: list[int] = truck["assigned_deliveries"]
        if add:
            deliveries.append(delivery_id)
            new_weight = truck["Miktar"] + Miktar
            new_volume = truck["Palet"] + volume_delta
            new_status = "loading"
        else:
            if delivery_id in deliveries:
                deliveries.remove(delivery_id)
            new_weight = max(0, truck["Miktar"] - Miktar)
            new_volume = max(0, truck["Palet"] - volume_delta)
            new_status = "idle" if len(deliveries) == 0 else "loading"

        mask = self.trucks_df["id"] == truck_id
        self.trucks_df = self.trucks_df.with_columns(
            pl.when(mask).then(pl.lit(round(new_weight, 1))).otherwise(pl.col("Miktar")).alias("Miktar"),
            pl.when(mask).then(pl.lit(round(new_volume, 2))).otherwise(pl.col("Palet")).alias("Palet"),
            pl.when(mask).then(pl.lit(json.dumps(deliveries))).otherwise(pl.col("assigned_deliveries")).alias("assigned_deliveries"),
            pl.when(mask).then(pl.lit(new_status)).otherwise(pl.col("status")).alias("status"),
        )
        return True

    # ── Analytics ────────────────────────────────────────────────────────

    def get_summary(self) -> dict:
        """Return an overall logistics summary computed with Polars."""
        total = self.coordinates_df.height
        assigned = self.coordinates_df.filter(pl.col("status") == "assigned").height
        pending = self.coordinates_df.filter(pl.col("status") == "pending").height

        Miktar = self.coordinates_df["Miktar"].sum()
        Palet = self.coordinates_df["Palet"].sum()

        trucks_active = self.trucks_df.filter(pl.col("status") != "idle").height
        trucks_idle = self.trucks_df.filter(pl.col("status") == "idle").height

        return {
            "total_deliveries": total,
            "assigned_deliveries": assigned,
            "pending_deliveries": pending,
            "Miktar": round(Miktar, 1),
            "Palet": round(Palet, 2),
            "trucks_active": trucks_active,
            "trucks_idle": trucks_idle,
        }

    def get_truck_capacities(self) -> list[dict]:
        """Return capacity percentages for all trucks."""
        rows = self.get_all_trucks()
        result = []
        for t in rows:
            wp = round((t["Palet"] / t["Capacity"]) * 100, 1) if t["Capacity"] > 0 else 0
            result.append({
                "truck_id": t["id"],
                "name": t["name"],
                "Palet_percent": wp,
                "delivery_count": len(t["assigned_deliveries"]),
            })
        return result

    def reset_all(self) -> None:
        """Reset all data to initial state."""
        birlesik_df, palet_ve_konumlar = read_data()
        self.coordinates_df = palet_ve_konumlar
        self.trucks_df = read_trucks()


  