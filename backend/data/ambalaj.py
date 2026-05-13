# %%
import polars as pl
import pandas as pd

#sales_df =pl.read_excel("../data/sales.xlsx")
#customer_df = pl.read_excel("../Müşteri Listesi.xlsx")
#pallet_df = pl.read_excel("../Palet Koli Raporu.xlsx")



def Palet_Acıklama(sales_df, customer_df, pallet_df):
    """
    Palet Ürün Açıklaması hesaplama fonksiyonu
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
            pl.col("İçerik"),
            pl.col("Palet")
        ])

        # Palet bilgilerini birleştir
        df = df.join(df_koli_raporu, on="product_code", how="left")

        # Palet sayısını hesapla
        df = df.with_columns([
            (pl.col("Miktar") / pl.col("Palet")).alias("Palet")
        ])

        # Müşteri konum bilgilerini işle
        df_mus = customer_df.select([
            pl.col("Şube Id").cast(pl.Utf8).alias("id"),
            pl.col("Enlem").alias("latitude"),
            pl.col("Boylam").alias("longitude")
        ])

        # Konum bilgilerini birleştir
        df = df.join(df_mus, on="id", how="left")
        
        df = df.group_by("İçerik").agg([
            pl.col("Miktar").sum(),
            pl.col("Palet").sum(),
        ]).sort("İçerik")
        

        # Pandas'a çevir ve geri döndür
        df_dicts = df.to_dicts()
        return df_dicts

    except Exception as e:
        print(f"Palet_Acıklama hatası: {e}")
        return {}

#Palet_Acıklama(sales_df, customer_df, pallet_df)
