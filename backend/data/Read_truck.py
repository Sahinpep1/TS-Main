import polars as pl

def read_trucks():
    try:
        trucks_df = pl.read_excel(r"data/trucks.xlsx")
        trucks_df = trucks_df.with_columns(
            pl.col("id").cast(pl.Int64),
            pl.col("Plaka").cast(pl.Utf8),
            pl.col("Driver").cast(pl.Utf8),
            pl.col("Capacity").cast(pl.Int64),
            pl.col("Miktar").cast(pl.Int64),
            pl.col("Palet").cast(pl.Int64)
            
        )
        return trucks_df
    except Exception as e:
        print(f"Error reading trucks: {e}")
        return None

print(read_trucks())