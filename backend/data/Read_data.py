
import sys
import os

# This adds the 'backend' folder to the search path
# so that 'services' can be found.
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from data.palet_sayisi import Palet_Hesaplama
from data.konumlar import Konumlar_Hesaplama
import polars as pl


def read_data():
    bekleyen_file = r"data\Bekleyen_Siparisler.xlsx"
    hazir_file = r"data\Hazir_Siparisler.xlsx"


    df = pl.read_excel(bekleyen_file)
    bekleyen_df=df.with_columns(
        pl.lit("pending").cast(pl.Utf8).alias("status")
    )
    df2 = pl.read_excel(hazir_file)
    hazir_df=df2.with_columns(
        pl.lit("delivered").cast(pl.Utf8).alias("status")
    )
    df3 = pl.concat([bekleyen_df, hazir_df], how="vertical_relaxed")
    birlesik_df=df3.with_columns(
        pl.col("Miktar").cast(pl.Int64),
        pl.col("Fatura Sayısı").cast(pl.Int64),
        pl.col("FKMS").cast(pl.Int64),
        pl.col("Genel Toplam").cast(pl.Float64),
        pl.col("SATIŞ TEMSİLCİSİ Kodu").cast(pl.Utf8),
        pl.col("SATIŞ TEMSİLCİSİ").cast(pl.Utf8),
        pl.col("NOKTA Kodu").cast(pl.Utf8),
        pl.col("NOKTA").cast(pl.Utf8),
        pl.col("ÜRÜN Kodu").cast(pl.Utf8),
        pl.col("ÜRÜN").cast(pl.Utf8)
    )
    birlesik_df = birlesik_df.select(
        pl.col("SATIŞ TEMSİLCİSİ Kodu").alias("sales_rep_code"),
        pl.col("SATIŞ TEMSİLCİSİ").alias("sales_rep"),
        pl.col("NOKTA Kodu").alias("id"),
        pl.col("NOKTA").alias("name"),
        pl.col("ÜRÜN Kodu").alias("product_code"),
        pl.col("ÜRÜN").alias("product_name"),
        pl.col("Miktar"),
        pl.col("Fatura Sayısı"),
        pl.col("Genel Toplam"),
        pl.col("status")
    )


    birlesik_df = birlesik_df.filter(pl.col("sales_rep_code").is_not_null())


    customer_file = r"..\data\müşteri listesi.xlsx"
    pallet_file =r"..\data\palet koli raporu.xlsx"
    customer_file = r"C:\Users\user\Desktop\TS-Main\backend\data\Müşteri Listesi.xlsx"
    pallet_file =r"C:\Users\user\Desktop\TS-Main\backend\data\Palet Koli Raporu.xlsx"

    customer_df = pl.read_excel(customer_file)
    pallet_df = pl.read_excel(pallet_file)
    palet_sayisi= Palet_Hesaplama(birlesik_df,customer_df,pallet_df)
    konumlar = Konumlar_Hesaplama(birlesik_df,customer_df,pallet_df)
    #print(konumlar)
    #print(palet_sayisi)
    #print(birlesik_df)
    ozet = palet_sayisi.join(konumlar, on="id", how="left")
    palet_ve_konumlar = ozet.drop(["name_right", "sales_rep_right"])
    palet_ve_konumlar = palet_ve_konumlar.with_columns(
        pl.col("id").cast(pl.Int64),
        pl.lit(None, dtype=pl.Int64).alias("assigned_truck_id"),
    )
    print(palet_ve_konumlar)
    
    return birlesik_df,palet_ve_konumlar



