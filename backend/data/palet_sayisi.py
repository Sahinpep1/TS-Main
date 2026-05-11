import polars as pl
import pandas as pd

def Palet_Hesaplama(sales_df, customer_df, pallet_df):
    """
    Palet sayısı hesaplama fonksiyonu
    """
    try:
        # Satış verilerini işle
        df = sales_df.select([
            pl.col("id"),
            pl.col("name"),
            pl.col("sales_rep"),
            pl.col("product_code"),
            pl.col("product_name"),
            pl.col("Miktar").alias("Miktar")
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
            pl.col("Enlem").alias("latitude"),
            pl.col("Boylam").alias("longitude")
        ])

        # Konum bilgilerini birleştir
        df = df.join(df_mus, on="id", how="left")
        
        # NOKTA bazında toplam palet sayısını hesapla
        df = df.group_by("id").agg([
            pl.col("name").first(),
            pl.col("sales_rep").first(),
            pl.col("Palet_Sayısı").sum(),
            pl.col("Miktar").sum(),
        ])

        # Pandas'a çevir ve geri döndür
        #df_dicts = df.to_dicts()
        return df

    except Exception as e:
        print(f"Palet hesaplama hatası: {e}")
        return {}
