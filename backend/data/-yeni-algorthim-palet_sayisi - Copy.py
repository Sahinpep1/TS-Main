import polars as pl

def Palet_Hesaplama(sales_df, customer_df, pallet_df):
    """
    100x120 İçecek Paleti Standartlarına ve Saha Kurallarına Uygun
    Gelişmiş Palet Sayısı Hesaplama Fonksiyonu
    """
    try:
        # 1. Satış verilerini seç ve temizle
        df = sales_df.select([
            pl.col("id"),
            pl.col("name"),
            pl.col("sales_rep"),
            pl.col("product_code"),
            pl.col("product_name"),
            pl.col("Miktar")
        ]).drop_nulls(subset=["id"])

        # 2. Palet (100x120 İçecek Paleti) koli kapasite raporunu işle
        df_koli_raporu = pallet_df.select([
            pl.col("Ürün-> Ürün No").alias("product_code"),
            pl.col("Palet").alias("Paletteki_Toplam_Koli") # Örn: Pepsi 2.5L için 64
        ])

        # 3. Satış verisi ile palet kapasitelerini birleştir
        df = df.join(df_koli_raporu, on="product_code", how="left")

        # --- SAHA KURALLARI VE ENTEGRASYON ---
        # Sabit kural: Tam palet üstüne maksimum 3 koli atılabilir (Taşma toleransı)
        TASMA_TOLERANSI = 3

        df = df.with_columns([
            # Tam kaç palet var? (Örn: 96 / 64 = 1 tam palet)
            (pl.col("Miktar") // pl.col("Paletteki_Toplam_Koli")).alias("tam_palet"),
            # Paletten sarkan koli sayısı nedir? (Örn: 96 % 64 = 32 koli kalan)
            (pl.col("Miktar") % pl.col("Paletteki_Toplam_Koli")).alias("kalan_koli")
        ]).with_columns([
            # EĞER kalan koli 3 veya daha azsa, işçiler üste atar -> miks palete yük kalmaz (0 olur)
            # ELSE kalan koli > 3 ise, bu adet miks palet havuzuna (oran olarak) aktarılır
            pl.when(pl.col("kalan_koli") <= TASMA_TOLERANSI)
            .then(0.0)
            .otherwise(pl.col("kalan_koli") / pl.col("Paletteki_Toplam_Koli"))
            .alias("miks_palet_payi")
        ]).with_columns([
            # Nihai palet yükü = Kesinleşen tam palet sayısı + miks payı
            (pl.col("tam_palet").cast(pl.Float64) + pl.col("miks_palet_payi")).alias("Hesaplanan_Palet")
        ])

        # 4. Müşteri konum bilgilerini işle
        df_mus = customer_df.select([
            pl.col("Şube Id").cast(pl.Utf8).alias("id"),
            pl.col("Enlem").alias("latitude"),
            pl.col("Boylam").alias("longitude")
        ])

        # 5. Konum bilgilerini ana tabloya bağla
        df = df.join(df_mus, on="id", how="left")
        
        # 6. MÜŞTERİ (NOKTA) bazında konsolide et
        # Sahadaki gibi tam paletleri ve miks kalıntıları doğru toplayarak grupluyoruz
        df_sonuc = df.group_by("id").agg([
            pl.col("name").first(),
            pl.col("sales_rep").first(),
            pl.col("latitude").first(),
            pl.col("longitude").first(),
            pl.col("Hesaplanan_Palet").sum().alias("Toplam_Palet"),
            pl.col("Miktar").sum().alias("Toplam_Miktar"),
        ])

        return df_sonuc

    except Exception as e:
        print(f"Palet hesaplama hatası: {e}")
        # Hata durumunda pipeline'ın çökmemesi için boş şemalı bir DataFrame dönmek daha güvenlidir
        return pl.DataFrame()