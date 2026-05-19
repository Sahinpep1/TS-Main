
import sys
import os
import json
import polars as pl
import pandas as pd
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

try:
    from yapilandirma_yoneticisi import load_config
    from rapor_otomasyon_servisi import RaporOtomasyonServisi
    from playwright.sync_api import sync_playwright
except ImportError as e:
    logger.error(f"ImportError: {e}")
    sys.exit(1)

class AutomationWorker():

    def __init__(self, target_date_str, five_days_ago_str):
        self.target_date_str = target_date_str
        self.five_days_ago_str = five_days_ago_str

    def run(self):
        try:
            logger.info("Yapılandırma yükleniyor...")
            config = load_config(os.path.join(os.path.dirname(__file__), "config.json"))
            default_pdf_path = os.path.abspath("./my_pdf_downloads")
            os.makedirs(default_pdf_path, exist_ok=True)

            with sync_playwright() as p:
                context = p.chromium.launch_persistent_context(
                    user_data_dir="./browser_profile", 
                    headless=False,
                    args=["--no-sandbox", "--disable-gpu", "--kiosk-printing"],
                    viewport={"width": 1920, "height": 1080},
                    accept_downloads=True,
                    downloads_path=default_pdf_path  # Tells Chromium where to drop the files
                )

                page = context.pages[0] if context.pages else context.new_page()
                service = RaporOtomasyonServisi(page, config)
                
                logger.info("Giriş yapılıyor...")
                if not service.perform_login():
                    logger.error("Giriş başarısız.")
                    return False, "Giriş başarısız."
                
                # Sipariş URL'si (Güncellenebilir)
                SIPARIS_URL = "https://pepsell.pepsicosell.com/Doc/BulkDocumentProcessing" 
                aranan_musteriler = ["5210512"]
                logger.info("Bekleyen Siparişler çekiliyor...")
                service.sipraris_duzenle(
                    rapor_url=SIPARIS_URL,
                    validation ="Menu_ContentPlaceHolder_btnList",  # Rapor butonu doğrulama
                    siparis_id_list=aranan_musteriler,
                    tarih_stringi=self.five_days_ago_str,
                    tarih_stringi_2=self.target_date_str
                )
                service.faturalasmis_duzenle(
                    rapor_url=SIPARIS_URL,
                    validation ="Menu_ContentPlaceHolder_btnList",  # Rapor butonu doğrulama
                    pdf_ismi="Faturalanmış_Siparişler",
                    siparis_id_list=aranan_musteriler,
                    tarih_stringi=self.five_days_ago_str,
                    tarih_stringi_2=self.target_date_str
                )
                #Burdan sonra müşteri ID'lerini tek tek seçmek yerine, topluca seçmek için yeni bir fonksiyon yazdım. Yukarıdaki sipraris_duzenle fonksiyonunda bu yeni fonksiyonu çağırarak müşteri ID'lerini tek seferde seçiyoruz.
                #service.select_document_domain("Fatura")
                #service.select_document_e_belge("E-Arşiv kullananlar")
                #service.st_sec()
                #service.select_grid_by_customer_id_fast(6098195)
                

                # Tek komutla hepsini seçin!
                #service.select_documents_by_id_list(aranan_musteriler)
                #service.git_temsilci_yukleme_listesi()
                #service.rapor_kapat()
                #input("Müşteri ID'leri seçildi. Doğrulamak için Enter'a basın...")
                # Excel indirmesi bittikten sonra bu satırı ekleyin:
                #service.telerik_print_pdf_kaydet("Son_deneme")
                input("PDF'ler kaydedildi. Doğrulamak için Enter'a basın...")
                context.close()
            logger.info("Sipariş verileri başarıyla çekildi.")
            return True, "Sipariş verileri başarıyla çekildi."
        except Exception as e:
            logger.error(f"Hata: {str(e)}")
            return False, f"Hata: {str(e)}"

if __name__ == "__main__":
    # Example usage
    today = datetime.now()
    five_days_ago = today - timedelta(days=5)
    target_date = today +timedelta(days=1)

    target_date = target_date.strftime("%d.%m.%Y")
    five_days_ago_str = five_days_ago.strftime("%d.%m.%Y")
    
    logger.info(f"Starting automation for dates: {five_days_ago_str} to {target_date}")
    
    worker = AutomationWorker(target_date, five_days_ago_str)
    success, message = worker.run()
    
    if success:
        logger.info("Automation completed successfully.")
    else:
        logger.error(f"Automation failed: {message}")
