import Polars as pl
import os
import pandas as pd

bekleyen_file = os.path.join("indirilen_raporlar", "Bekleyen_Siparisler.xlsx")
hazir_file = os.path.join("indirilen_raporlar", "Hazir_Siparisler.xlsx")  

def load_data(self):
    """Veri dosyalarını yükle"""
    try:
        if not hasattr(self, 'data_folder'):
            self.data_folder = "../data"  # Varsayılan klasör
            
        if not os.path.exists(self.data_folder):
            print("Uyarı", f"Veri klasörü bulunamadı: {self.data_folder}")
            return
            
        # Hangi verinin yükleneceğini belirle
        current_mode = getattr(self, "data_source_combo", None)
        mode_text = current_mode.currentText() if current_mode else "Tüm Siparişler (Açık + Hazır)"
        

        if not os.path.exists(bekleyen_file) or not os.path.exists(hazir_file):
            print("Dosya Bulunamadı", "Otomasyon dosyaları bulunamadı.\\nLütfen önce 'Sipariş Verilerini Çek' butonuna tıklayın.")
            return
        
        df = pl.read_excel(bekleyen_file)
        df=df.with_columns(
            pl.lit("waiting").cast(pl.Utf8).alias("status")
        )
        df2 = pl.read_excel(hazir_file)
        df2=df2.with_columns(
            pl.lit("ready").cast(pl.Utf8).alias("status")
        )
        df3 = pl.concat([df, df2], how="vertical_relaxed")
        df3=df3.with_columns(
            pl.col("Miktar").cast(pl.Int64),
            pl.col("Fatura Sayısı").cast(pl.Int64),
            pl.col("FKMS").cast(pl.Int64),
        )
        
        self.sales_df = df3
        


        customer_file = os.path.join(self.data_folder, "müşteri listesi.xlsx")
        pallet_file = os.path.join(self.data_folder, "palet koli raporu.xlsx")
        
        if not os.path.exists(customer_file):
            customer_file = os.path.join(self.data_folder, "customers.csv")
        if not os.path.exists(pallet_file):
            pallet_file = os.path.join(self.data_folder, "pallets.csv")
        
        if os.path.exists(customer_file):
            if customer_file.endswith('.xlsx'):
                self.customer_df = pl.read_excel(customer_file)
            else:
                self.customer_df = pl.read_csv(customer_file)
                
        if os.path.exists(pallet_file):
            if pallet_file.endswith('.xlsx'):
                self.pallet_df = pl.read_excel(pallet_file)
            else:
                self.pallet_df = pl.read_csv(pallet_file)
            
        if all([self.sales_df is not None, self.customer_df is not None, self.pallet_df is not None]):
            self.process_data()
            print("Veriler başarıyla yüklendi")
        else:
            print("Bilgi", "Bazı veri dosyaları bulunamadı. Örnek veriler kullanılacak.")
            self.create_sample_data()
            
    except Exception as e:
        import traceback
        tb_str = traceback.format_exc()
        with open("error_log.txt", "w", encoding="utf-8") as f:
            f.write(tb_str)
        print("Hata", f"Veri yükleme hatası: {str(e)}")
        self.create_sample_data()