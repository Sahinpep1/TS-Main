import polars as pl
import pandas as pd




def Konumlar_Hesaplama(sales_df, customer_df, pallet_df):
    """
    Konumlar hesaplama fonksiyonu
    """
    try:
        # Satış verilerini işle
        df = sales_df.select([
            pl.col("id"),
            pl.col("name"),
            pl.col("sales_rep"),
            pl.col("product_code"),
            pl.col("product_name"),
            pl.col("Miktar").alias("Miktar"),
            pl.col("status")
        ])
        df = df.drop_nulls(subset=["id"])

        # Palet raporu işle
        df_koli_raporu = pallet_df.select([
            pl.col("Ürün-> Ürün No").alias("product_code"),
            pl.col("Palet")
        ])

        # Palet bilgilerini birleştir
        df = df.join(df_koli_raporu, on="product_code", how="left")

        # Palet sayısını hesapla
        df = df.with_columns([
            (pl.col("Miktar") / pl.col("Palet")).alias("Palet_Sayısı")
        ])

        # Müşteri konum bilgilerini işle
        df_mus = customer_df.select([
        pl.col("Şube Id").cast(pl.Utf8).alias("id"),
        pl.col("Enlem").cast(pl.Utf8).str.replace(",", ".").cast(pl.Float64).alias("latitude"),
        pl.col("Boylam").cast(pl.Utf8).str.replace(",", ".").cast(pl.Float64).alias("longitude")
    ])

        # Konum bilgilerini birleştir
        df = df.join(df_mus, on="id", how="left")
        
        # ID olarak yeniden adlandır ve gruplandır
        df = df.group_by("id").agg([
            pl.col("name").first(),  # Use first() instead of unique() to avoid numpy array
            pl.col("sales_rep").first(),  # Use first() instead of unique()
            pl.col("longitude").first().alias("lng"),  # Use first() instead of unique()
            pl.col("latitude").first().alias("lat"),  # Use first() instead of unique()
            pl.col("status").first(),
        ]).sort("sales_rep", descending=False)

        # Pandas'a çevir ve geri döndür
        #df_dicts = df.to_dicts()
        return df

    except Exception as e:
        print(f"Konumlar hesaplama hatası: {e}")
        return {}
