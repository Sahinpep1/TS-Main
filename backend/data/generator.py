"""Generate sample logistics data using Polars — 100 coordinates and 15 trucks."""

import random
import polars as pl

# Seed for reproducibility
random.seed(42)

# ── Turkish city regions for realistic scatter ──────────────────────────
_REGIONS = [
    ("Istanbul", 41.0082, 28.9784, 0.15),
    ("Ankara", 39.9334, 32.8597, 0.10),
    ("Izmir", 38.4192, 27.1287, 0.08),
    ("Bursa", 40.1885, 29.0610, 0.06),
    ("Antalya", 36.8969, 30.7133, 0.06),
    ("Adana", 37.0000, 35.3213, 0.05),
    ("Konya", 37.8746, 32.4932, 0.05),
    ("Gaziantep", 37.0662, 37.3833, 0.05),
    ("Mersin", 36.8121, 34.6415, 0.04),
    ("Kayseri", 38.7312, 35.4787, 0.04),
    ("Eskisehir", 39.7767, 30.5206, 0.03),
    ("Trabzon", 41.0027, 39.7168, 0.03),
    ("Samsun", 41.2867, 36.3300, 0.03),
    ("Denizli", 37.7765, 29.0864, 0.03),
    ("Diyarbakir", 37.9144, 40.2306, 0.03),
]

_PRIORITIES = ["high", "medium", "low"]
_PRIORITY_WEIGHTS = [0.2, 0.5, 0.3]

_TRUCK_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6",
    "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
]


def generate_coordinates(n: int = 100) -> pl.DataFrame:
    """Generate n random delivery coordinates across Turkey."""
    rows: list[dict] = []
    for i in range(1, n + 1):
        # Pick a region weighted by distribution
        region = random.choices(
            _REGIONS, weights=[r[3] for r in _REGIONS], k=1
        )[0]
        name, base_lat, base_lng, _ = region
        lat = base_lat + random.uniform(-0.25, 0.25)
        lng = base_lng + random.uniform(-0.25, 0.25)
        weight = round(random.uniform(50, 2000), 1)
        volume = round(random.uniform(0.1, 8.0), 2)
        priority = random.choices(_PRIORITIES, weights=_PRIORITY_WEIGHTS, k=1)[0]
        rows.append(
            {
                "id": i,
                "lat": round(lat, 6),
                "lng": round(lng, 6),
                "label": f"{name}-{i:03d}",
                "weight_kg": weight,
                "volume_m3": volume,
                "priority": priority,
                "status": "pending",
                "assigned_truck_id": None,
            }
        )
    return pl.DataFrame(rows)


def generate_trucks(n: int = 15) -> pl.DataFrame:
    """Generate n trucks with varying capacities."""
    rows: list[dict] = []
    plate_cities = [
        "34", "06", "35", "16", "07", "01", "42", "27",
        "33", "38", "26", "61", "55", "20", "21",
    ]
    for i in range(1, n + 1):
        max_weight = random.choice([8000, 10000, 12000, 15000, 20000])
        max_volume = round(max_weight / 1800, 1)
        rows.append(
            {
                "id": i,
                "name": f"Truck-{i:02d}",
                "plate": f"{plate_cities[i-1]} TR {random.randint(100,999):03d}",
                "max_weight_kg": float(max_weight),
                "max_volume_m3": max_volume,
                "current_weight_kg": 0.0,
                "current_volume_m3": 0.0,
                "assigned_deliveries": "[]",
                "color": _TRUCK_COLORS[i - 1],
                "status": "idle",
            }
        )
    return pl.DataFrame(rows)
