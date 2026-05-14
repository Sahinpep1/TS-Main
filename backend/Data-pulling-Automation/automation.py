
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
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=False , args=["--no-sandbox", "--disable-gpu"])
                context = browser.new_context(viewport={"width": 1920, "height": 1080}, accept_downloads=True)
                page = context.new_page()
                
                service = RaporOtomasyonServisi(page, config)
                
                logger.info("Giriş yapılıyor...")
                if not service.perform_login():
                    logger.error("Giriş başarısız.")
                    return False, "Giriş başarısız."
                
                # Sipariş URL'si (Güncellenebilir)
                SIPARIS_URL = "https://pepsell.pepsicosell.com/Reporting/Sales/Sales" 
                
                logger.info("Bekleyen Siparişler çekiliyor...")
                service.calisma_akisi_siparisler(
                    rapor_url=SIPARIS_URL,
                    sablon_adi="açık siparişler",
                    hedef_rapor_adi="Bekleyen_Siparisler",
                    tarih_stringi=self.five_days_ago_str,
                    tarih_stringi_2=self.target_date_str
                )
                
                logger.info("Teslimata Hazır Siparişler çekiliyor...")
                service.calisma_akisi_siparisler(
                    rapor_url=SIPARIS_URL,
                    sablon_adi="Satış_faturası",
                    hedef_rapor_adi="Hazir_Siparisler",
                    tarih_stringi=self.target_date_str,
                    tarih_stringi_2=self.target_date_str
                )
                
                context.close()
                browser.close()
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
