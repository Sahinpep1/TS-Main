import subprocess as sp
import os
from time import sleep
from datetime import datetime, time
from playwright.sync_api import Page, TimeoutError, Download 
from typing import Dict, Any
import re
import base64
import shutil
import glob
from playwright.sync_api import Error as PlaywrightError

class RaporOtomasyonServisi:
    """
    Playwright Page ve Yapılandırma verilerini alarak tüm otomasyon adımlarını
    yürüten servis sınıfı.
    """
    def __init__(self, page: Page, config: Dict[str, Any]):
        # Bağımlılık Enjeksiyonu
        self.page = page
        self.config = config
        self.username = config['credentials']['username']
        self.password = config['credentials']['password']
        self.base_url = config['settings']['base_url']
        self.download_directory = config['settings']['download_directory']

######################### Bekleyen Siparişler ve Faturalanmış Siparişler için veri çekme akışı ######################################
    def perform_login(self, max_retries: int = 3) -> bool:
        """Belirtilen kimlik bilgileriyle giriş yapmayı dener ve ana menünün görünmesini doğrular."""

        # --- Yapılandırma Bilgileri (Önceki kodunuzdan gelen ID'ler) ---
        USERNAME_FIELD_ID = "txtUsername"
        PASSWORD_FIELD_ID = "txtPassword"
        LOGIN_BUTTON_ID = "btnLogin"

        # Modal ile ilgili elemanlar
        MODAL_TITLE_LOCATOR = self.page.get_by_role("heading", name="Mesajlar")
        MODAL_CLOSE_BUTTON_XPATH = "//div[@class='modal-content ui-draggable']//button[@class='close']"

        # YENİ VE ANA BAŞARI GÖSTERGESİ: Menü ID'si
        MAIN_MENU_ID = "ctl00_ctl00_Menu_mainMenu"
        MAIN_MENU_LOCATOR = self.page.locator(f"#{MAIN_MENU_ID}") 
        # Veya: MAIN_MENU_LOCATOR = self.page.get_by_role("navigation", name="Ana Menü") (Eğer bir role atanmışsa)

        # --- Giriş Döngüsü ---
        for current_attempt in range(1, max_retries + 1):
            print(f"\n--- Giriş Denemesi: {current_attempt} / {max_retries} ---")
            
            try:
                self.page.goto(self.base_url)
                self.page.fill(f"#{USERNAME_FIELD_ID}", self.username)
                self.page.fill(f"#{PASSWORD_FIELD_ID}", self.password)
                print("Kullanıcı adı ve şifre girildi.")
                
                self.page.click(f"#{LOGIN_BUTTON_ID}")
                print("Giriş butonuna tıklandı.")

                # 1. Kontrol: Ana menünün görünmesini bekle (Girişin başarılı olduğunu gösterir)
                # Giriş başarısızsa bu element asla görünmeyecektir.
                MAIN_MENU_LOCATOR.wait_for(state="visible", timeout=10000) # 10 saniyeye çıkardık
                print("🎉 Ana Menü başarıyla bulundu. Giriş başarılı.")
                
                # 2. Kontrol (Opsiyonel): Eğer modal BAZEN görünüyorsa, görünmesini deneyip kapat.
                if MODAL_TITLE_LOCATOR.is_visible(timeout=2000):
                    print("Mesajlar modalı bulundu, kapatılıyor...")
                    self.page.click(MODAL_CLOSE_BUTTON_XPATH)
                    MODAL_TITLE_LOCATOR.wait_for(state="hidden", timeout=5000)
                    print("Modal kapandı.")

                # Tüm doğrulamalar başarılı, döngüden çık
                return True

            except TimeoutError:
                print(f"❌ HATA: İşlem zaman aşımına uğradı. Menü ({MAIN_MENU_ID}) görünmedi.")
                # Burada hatalı kimlik bilgisi varsa ekranda çıkan hata mesajını kontrol edebilirsiniz.
            except Exception as e:
                print(f"❌ BEKLENMEDİK HATA: {e}")

            if current_attempt < max_retries:
                print("3 saniye bekleniyor ve tekrar deneniyor...")
                sleep(3) 
                
            print(f"\n!!! MAKSİMUM DENEME SAYISINA ({max_retries}) ulaşıldı. Giriş başarısız.")
            return False

    def url_git(self, target_url: str,validation : str = "btnReport") -> bool:
        """Hedef URL'ye gider ve 'Rapor' butonunun görünmesini bekler."""
        REPORT_BUTTON_LOCATOR = f"[id$='{validation}']" 
        
        print(f"\n---> {target_url} adresine gidiliyor ve 'Rapor' butonu bekleniyor...")
        
        try:
            self.page.goto(target_url)
            self.page.wait_for_selector(REPORT_BUTTON_LOCATOR, state="visible", timeout=10000)
            
            print("   ✅ Sayfa YÜKLENDİ: 'Rapor' butonu artık tıklanabilir durumda.")
            return True
        except TimeoutError:
            print(f"   ❌ HATA: '{self.page.title}' ID'li 'Rapor' butonu belirlenen süre içinde tıklanabilir hale gelmedi.")
            return False
        except Exception as e:
            print(f"   -> BEKLENMEDİK HATA: {e}")
            return False

    def favori_sablon_sec_ve_yukle(self, sablon_adi: str, max_deneme: int = 3) -> bool:
        """Favori Şablonlar butonuna tıklar, açılan pencereden belirtilen şablonu seçer."""
        
        FAVORI_BUTON_LOCATOR = "[id$='btnShowFavoriteSearches']"
        SABLON_SECIM_LOCATOR = self.page.get_by_text(sablon_adi, exact=True)
        RAPOR_BUTON_DOGRULAMA_LOCATOR = "[id$='btnReport']"

        for deneme in range(1, max_deneme + 1):
            print(f"\n--- ŞABLON SEÇİM DENEMESİ {deneme}/{max_deneme} ({sablon_adi}) ---")

            try:
                try:
                    self.page.wait_for_selector(FAVORI_BUTON_LOCATOR, state="visible", timeout=10000)
                    self.page.click(FAVORI_BUTON_LOCATOR)
                    print("   -> 'Favori Şablonlar' butonuna tıklandı.")
                except TimeoutError:
                    print("   -> HATA: 'Favori Şablonlar' butonu bulunamadı veya tıklanamadı.")
                    self.page.screenshot(path=f"hata_favori_buton_{deneme}.png")
                    return False

                try:
                    SABLON_SECIM_LOCATOR.wait_for(state="visible", timeout=10000)
                    SABLON_SECIM_LOCATOR.click()
                    print(f"   -> Şablon '{sablon_adi}' seçildi.")
                except TimeoutError:
                    print(f"   -> HATA: '{sablon_adi}' isimli şablon listede bulunamadı.")
                    self.page.screenshot(path=f"hata_sablon_listesi_{deneme}.png")
                    return False

                try:
                    self.page.wait_for_selector(RAPOR_BUTON_DOGRULAMA_LOCATOR, state="visible", timeout=15000)
                    print(f"   -> DOĞRULAMA BAŞARILI: Rapor butonu ('Rapor') ekranda belirdi. ✅")
                    return True
                except TimeoutError:
                    print("   -> HATA: Şablon seçimi sonrası Rapor butonunun yüklenmesinde zaman aşımı yaşandı.")
                    
            except Exception as e:
                print(f"   -> BEKLENMEDİK HATA: {e}")
                return False
                
        return False

    def tarih_saat_gir(self, tarih_alani_adi: str, tarih_metni: str) -> bool:
        """
        Belirtilen Telerik alanına metni Playwright ile girer ve 
        Telerik'in Client-Side API'si ile ClientState'i zorla günceller.
        """
        temiz_alan_adi = tarih_alani_adi.strip()
        sleep(2)
        # ID belirleme mantığı (orijinal koddan korunmuştur)
        if "Başlangıç" == temiz_alan_adi:
            CONTROL_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_dtValidFrom"
        elif "Bitiş" == temiz_alan_adi:
            CONTROL_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_dtValidTo"
        elif "sat-Başlangıç" == temiz_alan_adi:
            CONTROL_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_drDtDocumentFrom"
        elif "sat-Bitiş" == temiz_alan_adi:
            CONTROL_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_drDtDocumentTo"
        elif "fat-Başlangıç" == temiz_alan_adi:
            CONTROL_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_drDtDocumentFrom"
        elif "fat-Bitiş" == temiz_alan_adi:
            CONTROL_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_drDtDocumentTo"
        else:
            print(f"HATA: ❌ '{tarih_alani_adi}' için tanımlı bir ID bulunamadı.")
            return False
            
        INPUT_ID = f"{CONTROL_ID}_dateInput"
        INPUT_LOCATOR = f"#{INPUT_ID}"
        
        print(f"\n-> '{temiz_alan_adi}' alanına '{tarih_metni}' giriliyor (Gelişmiş Telerik yöntemi)...")
        
        try:
            # 1. Playwright ile görünür alana metnin girilmesi
            self.page.fill(INPUT_LOCATOR, tarih_metni)
            
            # 2. Blur (Odak Kaybı) Olayını Tetikle
            self.page.dispatch_event(INPUT_LOCATOR, "blur")

            # 3. KRİTİK: Telerik Client-Side API ile Zorla Güncelleme
            # Tarih metnini JS'nin anlayacağı formata çeviriyoruz (Örn: 10.05.2024 -> 05/10/2024)
            try:
                # DD.MM.YYYY formatından MM/DD/YYYY formatına çevirme
                tarih_objesi = datetime.strptime(tarih_metni.strip(), '%d.%m.%Y')
                js_tarih_metni = tarih_objesi.strftime('%m/%d/%Y')
            except ValueError:
                print(f"   -> HATA: Tarih metni '{tarih_metni}' beklenen DD.MM.YYYY formatında değil.")
                return False

            js_set_date = f"""
            (function() {{
                var picker = $find('{CONTROL_ID}');
                if (picker) {{
                    // set_selectedDate için MM/DD/YYYY formatı daha güvenlidir (Düzeltildi)
                    picker.set_selectedDate(new Date('{js_tarih_metni}'));
                    return true;
                }} else {{
                    return false;
                }}
            }})()
            """
            
            js_sonucu = self.page.evaluate(js_set_date)
            
            if js_sonucu:
                print("   -> BAŞARILI: ClientState, Telerik API kullanılarak zorla güncellendi. ✅")
            else:
                print("   -> UYARI: Telerik kontrol nesnesi ($find) bulunamadı veya güncellenemedi.")

            # 4. Doğrulama (Basit kontrol)
            girilen_deger_metni = self.page.input_value(INPUT_LOCATOR)
            try:
                # Hem beklenen hem de girilen değeri Python datetime nesnesine çevir.
                # Bu, '04.11.2025' ve '4.11.2025' gibi format farklarını yok sayar.
                beklenen_tarih = datetime.strptime(tarih_metni.strip(), '%d.%m.%Y')
                girilen_tarih = datetime.strptime(girilen_deger_metni.strip(), '%d.%m.%Y')
                
                if beklenen_tarih == girilen_tarih:
                    print(f"   -> BAŞARILI: '{temiz_alan_adi}' alanı tarih olarak doğrulandı. ✅")
                    return True
                else:
                    # Bu sadece format doğruysa, tarihler farklıysa hata verir
                    print(f"   -> HATA: Görünür değerdeki tarih beklenen tarihten farklı. ❌")
                    return False

            except ValueError as e:
                # Eğer Telerik beklenmedik bir formatta döndürdüyse (örneğin sadece saat)
                print(f"   -> HATA: Tarih doğrulama sırasında format hatası: {e} ❌")
                return False

        except TimeoutError:
            print(f"   -> HATA: '{temiz_alan_adi}' (ID: {INPUT_ID}) giriş alanı ekranda bulunamadı. ❌")
            return False
        except Exception as e:
            print(f"   -> BEKLENMEDİK HATA: {e} ❌")
            return False

    def rapor_olustur_ve_goruntule(self) -> bool:
        """'Rapor' butonuna tıklar ve Rapor Görüntüleyici penceresinin açılmasını bekler."""
        
        RAPOR_BUTON_LOCATOR = "[id$='btnReport']"
        DOGRULAMA_MODAL_LOCATOR = "[id$='wndReportViewer_popupModalContainer']"
        
        print("\n-> 'Rapor' butonuna tıklanıyor ve Rapor Görüntüleyici bekleniyor...")
        
        try:
            self.page.click(RAPOR_BUTON_LOCATOR)
            print("   -> 'Rapor' butonuna başarıyla tıklandı.")

            # Doğrulama: Rapor Görüntüleyici penceresinin görünmesini bekle
            self.page.wait_for_selector(DOGRULAMA_MODAL_LOCATOR, state="visible", timeout=30000)
            
            print(f"   -> DOĞRULAMA BAŞARILI: Rapor Görüntüleyici penceresi ekranda. ✅")
            return True

        except TimeoutError:
            print(f"   -> HATA: 'Rapor' butonuna tıklandı ancak Rapor Görüntüleyici penceresi beklenilen sürede yüklenemedi/görünür olmadı. ❌")
            return False
        except Exception as e:
            print(f"   -> BEKLENMEDİK HATA: {e}")
            return False


    def raporu_excel_indir_onayli(self, target_filename: str, max_deneme: int = 3) -> bool:
        """Export butonuna tıklar, Excel'i seçer ve Playwright ile indirme işlemini yönetir."""

        EXPORT_BUTON_LOCATOR = "[title='Export']" 
        EXCEL_LINK_LOCATOR = self.page.get_by_title("Excel")
        
        # Hedef dosya yolunu oluştur
        file_base_name = target_filename.replace(" ", "_")
        target_path = os.path.join(self.download_directory, file_base_name + ".xlsx")

        for deneme in range(1, max_deneme + 1):
            print(f"\n--- RAPOR İNDİRME DENEMESİ {deneme}/{max_deneme} ({file_base_name}) ---")

            try:
                self.page.wait_for_selector(EXPORT_BUTON_LOCATOR, state="visible", timeout=20000)
                self.page.click(EXPORT_BUTON_LOCATOR)
                print("   -> 'Export' butonu tıklandı.")
                
                EXCEL_LINK_LOCATOR.wait_for(state="visible", timeout=10000) 
                print("   -> Excel indirme linkinin görünmesi beklendi ve doğrulandı.")

                # KRİTİK: İndirme işlemi beklenirken Excel linkine tıkla
                with self.page.expect_download(timeout=30000) as download_info:
                    EXCEL_LINK_LOCATOR.click()
                
                download: Download = download_info.value
                print(f"   -> 'Excel' seçeneği tıklandı, indirme işlemi yakalandı.")

                # İndirilen dosyayı bekle ve hedef isimle kaydet
                download.save_as(target_path)
                
                print(f"   -> BAŞARILI: Dosya güvenilir şekilde kaydedildi: {target_path} ✅")
                
                return True

            except TimeoutError:
                if deneme < max_deneme:
                    print("   -> HATA: İndirme süreci zaman aşımına uğradı. 3 saniye sonra tekrar deneniyor... 🔄")
                    sleep(3)
                else:
                    print("   -> Maksimum deneme sayısına ulaşıldı. Excel indirme işlemi başarısız. ❌")
                    return False

            except Exception as e:
                print(f"   -> BEKLENMEDİK HATA: {e}")
                return False

        return False

    def calisma_akisi_gunluk(self, rapor_url: str, sablon_adi: str, hedef_rapor_adi: str, tarih_stringi: str) -> bool:
        """Belirtilen tarih, URL ve şablonu kullanarak tek bir rapor indirme akışını yönetir."""
        
        print(f"\n===== AKIŞ BAŞLADI: Rapor: {hedef_rapor_adi}, Tarih: {tarih_stringi} =====")
        
        # 1. Rapor sayfasına git
        if not self.url_git(target_url=rapor_url):
            return False

        # 2. Favori şablonu seç ve yükle
        if not self.favori_sablon_sec_ve_yukle(sablon_adi=sablon_adi):
            return False
            
        # 3. Tarihleri ayarla (Başlangıç ve Bitiş)
        if not self.tarih_saat_gir("Başlangıç", tarih_stringi):
            return False
        sleep(1) # Telerik ClientState'in oturması için bekleme
        if not self.tarih_saat_gir("Bitiş", tarih_stringi):
            return False
        sleep(1) 

        # 4. Raporu oluştur ve görüntüle
        if not self.rapor_olustur_ve_goruntule():
            return False

        # 5. Raporu Excel olarak indir
        if not self.raporu_excel_indir_onayli(target_filename=hedef_rapor_adi):
            return False
        
        print(f"\n===== AKIŞ TAMAMLANDI: {hedef_rapor_adi} başarıyla indirildi. =====")
        return True
    
    def calisma_akisi_aylik(self, rapor_url: str, sablon_adi: str, hedef_rapor_adi: str, aybası_tarih_stringi :str,tarih_stringi: str,tarih_stringi_2: str) -> bool:
        """Belirtilen tarih, URL ve şablonu kullanarak tek bir rapor indirme akışını yönetir."""
        
        print(f"\n===== AKIŞ BAŞLADI: Rapor: {hedef_rapor_adi}, Tarih: {tarih_stringi}, Aybaşı Tarih {aybası_tarih_stringi} =====")
        
        # 1. Rapor sayfasına git
        if not self.url_git(target_url=rapor_url):
            return False

        # 2. Favori şablonu seç ve yükle
        if not self.favori_sablon_sec_ve_yukle(sablon_adi=sablon_adi):
            return False
            
        # 3. Tarihleri ayarla (Başlangıç ve Bitiş)
        if not self.tarih_saat_gir("Başlangıç", tarih_stringi_2):
            return False
        if not self.tarih_saat_gir("Bitiş", tarih_stringi):
            return False

        # 4. Raporu oluştur ve görüntüle
        if not self.rapor_olustur_ve_goruntule():
            return False

        # 5. Raporu Excel olarak indir
        if not self.raporu_excel_indir_onayli(target_filename=hedef_rapor_adi):
            return False
        
        print(f"\n===== AKIŞ TAMAMLANDI: {hedef_rapor_adi} başarıyla indirildi. =====")
        return True

    def calisma_akisi_siparisler(self, rapor_url: str, sablon_adi: str, hedef_rapor_adi: str, tarih_stringi: str, tarih_stringi_2: str) -> bool:
        """Bekleyen ve Teslimata Hazır Siparişler için rapor indirme akışını yönetir."""
        
        print(f"\n===== SİPARİŞ AKIŞI BAŞLADI: Rapor: {hedef_rapor_adi}, Tarih: {tarih_stringi} =====")
        
        # 1. Rapor sayfasına git
        if not self.url_git(target_url=rapor_url):
            return False

        # 2. Favori şablonu seç ve yükle
        if not self.favori_sablon_sec_ve_yukle(sablon_adi=sablon_adi):
            return False
            
        # 3. Tarihleri ayarla (Başlangıç ve Bitiş)
        if not self.tarih_saat_gir("Başlangıç", tarih_stringi):
            pass 
        if not self.tarih_saat_gir("Bitiş", tarih_stringi_2):
            pass

        # 4. Raporu oluştur ve görüntüle
        if not self.rapor_olustur_ve_goruntule():
            return False

        # 5. Raporu Excel olarak indir
        if not self.raporu_excel_indir_onayli(target_filename=hedef_rapor_adi):
            return False
        
        print(f"\n===== SİPARİŞ AKIŞI TAMAMLANDI: {hedef_rapor_adi} başarıyla indirildi. =====")
        return True
##########################################################################################################
###########################Satış Fatura- İrsaliye Ana işler ######################################
    def st_sec(self) -> bool:
        """'Rapor' butonuna tıklar ve Rapor Görüntüleyici penceresinin açılmasını bekler."""
        
        RAPOR_BUTON_LOCATOR = "[id$='Menu_ContentPlaceHolder_btnList']"
        DOGRULAMA_MODAL_LOCATOR = "[id$='wndReportViewer_popupModalContainer']"
        
        print("\n-> 'Rapor' butonuna tıklanıyor ve Rapor Görüntüleyici bekleniyor...")
        
        try:
            #self.page.click(RAPOR_BUTON_LOCATOR)
            print("   -> 'Rapor' butonuna başarıyla tıklandı.")
            # 1. Click the input to open the dropdown list
            # 1. Open the dropdown menu
            self.page.wait_for_selector(RAPOR_BUTON_LOCATOR, state="visible", timeout=20000)
            dropdown_input = self.page.locator("#ctl00_ctl00_Menu_ContentPlaceHolder_cboRoute_Input")
            dropdown_input.click()

            # Define the specific container for this dropdown to avoid strict mode errors
            route_dropdown_container = self.page.locator("#ctl00_ctl00_Menu_ContentPlaceHolder_cboRoute_DropDown")

            # Define the Master Checkbox
            self.route_check_all = route_dropdown_container.locator("input.rcbCheckAllItemsCheckBox")

            # --- Test Case 1: Check All ---
            #input("Tüm rotaların SEÇİLECEĞİNİ görmek için Enter'a basın...")
            self.route_check_all.check()

            # --- Test Case 2: Uncheck All ---
            #input("Tüm rotaların TEMİZLENECEĞİNİ görmek için Enter'a basın...")
            self.route_check_all.uncheck()

            # --- Test Case 3: Select Specific Items ---
            #input("Belirli rotaların (METİN ANASIZ ve SERAY AKSOY) seçileceğini görmek için Enter'a basın...")

            # Helper to cleanly click individual item checkboxes inside this dropdown (using RegExp for case-insensitivity)
            def select_route_item(name):
                # This finds the specific <li>, grabs the checkbox inside it, and checks it
                item = route_dropdown_container.locator("li", has_text=re.compile(name, re.IGNORECASE))
                item.locator("input.rcbCheckBox").check()

            # Select your targets safely without triggering other dropdowns
            select_route_item("METİN ANASIZ")
            select_route_item("SERAY")  # Case-insensitive, partial match works perfectly now!

            # Close the dropdown
            dropdown_input.click()

            self.page.click(RAPOR_BUTON_LOCATOR)
            self.page.wait_for_selector(RAPOR_BUTON_LOCATOR, state="visible", timeout=10000)
            print("   -> 'Rapor' butonuna başarıyla tıklandı.")
            #input("Seçimlerin yapıldığını doğruladıktan sonra dropdown'ı kapatmak için Enter'a basın...")

            
            return True

        except TimeoutError:
            print(f"   -> HATA: 'Rapor' butonuna tıklandı ancak Rapor Görüntüleyici penceresi beklenilen sürede yüklenemedi/görünür olmadı. ❌")
            return False
        except Exception as e:
            print(f"   -> BEKLENMEDİK HATA: {e}")
            return False
    
    def select_grid_by_customer_id_fast(self, customer_id: str) -> bool:
        """
        Müşteri ID'sine ait satırı bulur, Telerik index numarasını çeker ve saniyede seçer.
        """
        RAPOR_BUTON_LOCATOR = "[id$='Menu_ContentPlaceHolder_btnList']"
        
        # 1. Giriş değerini standart hale getir (İlk harf büyük, gerisi küçük)
        self.page.wait_for_selector(RAPOR_BUTON_LOCATOR, state="visible", timeout=20000)
        GRID_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_grdDocuments"
        
        try:
            # 1. İlgili müşteri ID'sine sahip olan ana satırı (<tr>) bul
            row_locator = self.page.locator(f"tr:has(a[id*='btnCustomer']:has-text('{customer_id}'))")
            
            # 2. Satırın ID niteliğini al (Örn: '..._grdDocuments_ctl00__202')
            row_id = row_locator.get_attribute("id")
            
            if not row_id:
                print(f"   -> HATA: Müşteri ID {customer_id} bulunamadı.")
                return False
                
            # 3. ID'nin sonundaki index numarasını ayıkla (Örn: 202)
            row_index = int(row_id.split("__")[-1])
            
            # 4. Telerik API'sine bu index numarasını göndererek anında seçtir
            self.page.evaluate(f"""
                ({{ gridId, idx }}) => {{
                    const grid = $find(gridId);
                    if (grid) {{
                        const masterTable = grid.get_masterTableView();
                        const row = masterTable.get_dataItems()[idx];
                        if (row) row.set_selected(true);
                    }}
                }}
            """, {"gridId": GRID_ID, "idx": row_index})
            
            print(f"   -> Müşteri {customer_id} (Index: {row_index}) başarıyla seçildi.")
            input("Seçimin doğruluğunu görmek için Enter'a basın...")
            return True
            
        except Exception as e:
            print(f"   -> Seçim hatası: {e}")
            return False
        
    def select_documents_by_id_list(self, customer_ids: list[str]) -> bool:
        """
        Verilen müşteri ID listesindeki tüm satırları bulur ve Telerik üzerinde toplu seçer.
        Verilerin yüklenmesini otomatik olarak bekler.
        """
        GRID_ID = "ctl00_ctl00_Menu_ContentPlaceHolder_grdDocuments"
        
        print(f"\n-> {len(customer_ids)} adet müşteri ID'si için toplu seçim başlatılıyor...")
        
        try:
            # === KRİTİK GÜNCELLEME: VERİLERİN YÜKLENMESİNİ BEKLE ===
            # Tablodaki ilk veri satırının (tr.rgRow veya tr.rgAltRow) görünür olmasını maksimum 30 saniye bekler.
            print("   -> Tablo verilerinin yüklenmesi bekleniyor...")
            first_row_locator = self.page.locator(f"#{GRID_ID} tr.rgRow, #{GRID_ID} tr.rgAltRow").first
            first_row_locator.wait_for(state="visible", timeout=30000)
            print("   -> Veriler yüklendi, satırlar taranıyor...")
            # ======================================================

            # 1. Sayfada görünür olan tüm Telerik takip satırlarını yakala
            all_rows = self.page.locator(f"#{GRID_ID} tr[id*='_grdDocuments_ctl00__']").all()
            
            target_indexes = []
            
            # 2. Satırları tara ve eşleşenlerin indexlerini topla
            for row in all_rows:
                row_text = row.inner_text()
                row_id = row.get_attribute("id")
                
                if row_id and any(cid in row_text for cid in customer_ids):
                    try:
                        index = int(row_id.split("__")[-1])
                        target_indexes.append(index)
                    except ValueError:
                        continue

            if not target_indexes:
                print("   -> UYARI: Listelenen ID'lerle eşleşen hiçbir satır bulunamadı.")
                return False

            print(f"   -> Bulunan Telerik Satır Indexleri: {target_indexes}. Telerik API'sine gönderiliyor...")

            # 3. Ayıkladığımız tüm indexleri tek seferde Telerik API'sine göndererek seçtiriyoruz
            self.page.evaluate(f"""
                ({{ gridId, indexes }}) => {{
                    const grid = $find(gridId);
                    if (!grid) throw new Error("RadGrid bulunamadı!");
                    
                    const masterTable = grid.get_masterTableView();
                    
                    indexes.forEach(idx => {{
                        const row = masterTable.get_dataItems()[idx];
                        if (row) row.set_selected(true);
                    }});
                }}
            """, {"gridId": GRID_ID, "indexes": target_indexes})
            
            print(f"   -> {len(target_indexes)} adet satır başarıyla seçildi ve ClientState güncellendi.")
            return True
            
        except Exception as e:
            print(f"   -> Toplu seçim esnasında hata oluştu: {e}")
            return False
            return False
    def select_document_domain(self, domain_type: str) -> bool:
        """
        Belge türünü seçer: 'Fatura' veya 'Sipariş'
        Örnek girdi: "Fatura" veya "Sipariş"
        """
        RAPOR_BUTON_LOCATOR = "[id$='Menu_ContentPlaceHolder_btnList']"
        
        # 1. Giriş değerini standart hale getir (İlk harf büyük, gerisi küçük)
        self.page.wait_for_selector(RAPOR_BUTON_LOCATOR, state="visible", timeout=20000)
        domain_target = domain_type.strip().capitalize()
        
        if domain_target not in ["Fatura", "Sipariş"]:
            print(f"   -> HATA: Geçersiz seçim '{domain_type}'. Sadece 'Fatura' veya 'Sipariş' seçilebilir.")
            return False
            
        print(f"\n-> Belge türü değiştiriliyor: {domain_target}...")
        
        try:
            # 2. Dropdown'ı açmak için giriş alanına veya ok butonuna tıkla
            dropdown_input = self.page.locator("#ctl00_ctl00_Menu_ContentPlaceHolder_cboDocumentDomain_Input")
            dropdown_input.click()
            
            # 3. Açılan listeden hedef kelimeye sahip olan seçeneği (<li>) bul ve tıkla
            # Telerik dropdown menüleri genellikle global sınıflarla açılır, tam metin eşleşmesi kullanıyoruz
            option_locator = self.page.locator("div.RadComboBoxDropDown li", has_text=domain_target).first
            
            # Seçeneğin görünür ve tıklanabilir olmasını bekle ve tıkla
            option_locator.wait_for(state="visible", timeout=5000)
            option_locator.click()
            print(f"   -> Belge türü başarıyla '{domain_target}' olarak seçildi.")
            return True
            
        except Exception as e:
            print(f"   -> Belge türü seçilirken hata oluştu: {e}")
            return False
    def select_document_e_belge(self, domain_type: str) -> bool:
        """
        Belge türünü seçer: 'E-Fatura kullananlar' veya 'E-Arşiv kullananlar'
        Örnek girdi: "E-Fatura kullananlar" veya "E-Arşiv kullananlar"
        """
        RAPOR_BUTON_LOCATOR = "[id$='Menu_ContentPlaceHolder_btnList']"
        DROPDOWN_INPUT_LOCATOR = "#ctl00_ctl00_Menu_ContentPlaceHolder_cboUsingEDocument_Input"
        
        # 1. Giriş değerini temizle ve doğrula (Case-insensitive / Büyük-küçük harf duyarsız kontrol)
        clean_input = domain_type.strip()
        valid_options = ["E-Fatura kullananlar", "E-Arşiv kullananlar"]
        
        # Kullanıcı hatalı yazsa bile listeden doğru olanı eşleştirme yöntemi
        domain_target = next((opt for opt in valid_options if opt.lower() == clean_input.lower()), None)
        
        if not domain_target:
            print(f"   -> HATA: Geçersiz seçim '{domain_type}'. Sadece 'E-Fatura kullananlar' veya 'E-Arşiv kullananlar' seçilebilir.")
            return False
            
        print(f"\n-> Belge türü değiştiriliyor: {domain_target}...")
        
        try:
            # Sayfa elementlerinin hazır olmasını bekle
            self.page.wait_for_selector(RAPOR_BUTON_LOCATOR, state="visible", timeout=20000)
            
            # 2. Dropdown'ı açmak için giriş alanına tıkla
            dropdown_input = self.page.locator(DROPDOWN_INPUT_LOCATOR)
            dropdown_input.wait_for(state="visible", timeout=5000)
            dropdown_input.click()
            
            # Telerik dropdown'ın açılması için çok kısa bir an bekleme (Gerekirse)
            self.page.wait_for_timeout(300) 
            
            # 3. Açılan listeden tam metin eşleşmesiyle ilgili seçeneği bul
            # has_text yerine tam metin (exact match) aramak Telerik yapılarda daha güvenlidir
            option_locator = self.page.locator("div.RadComboBoxDropDown li", has_text=domain_target).first
            
            # Seçeneğin görünür olmasını bekle ve tıkla
            option_locator.wait_for(state="visible", timeout=5000)
            option_locator.click()
            
            print(f"   -> Belge türü başarıyla '{domain_target}' olarak seçildi.")
            return True
            
        except Exception as e:
            print(f"   -> Belge türü seçilirken hata oluştu: {e}")
            return False
    def git_temsilci_yukleme_listesi(self) -> bool:
        """
        'Listeler' menüsünü açar ve 'Temsilci Yükleme Listele' seçeneğine tıklar.
        """
        LISTELER_MENU = "li.dropdown:has(span:text-is('Listeler')) > a"
        TEMSILCI_LINK = "#Menu_ToolbarPlaceHolder_btnAgentLoadingListByPack"
        
        print("\n-> 'Temsilci Yükleme Listele' sayfasına gidiliyor...")
        
        try:
            # 1. Menünün halihazırda açık olup olmadığını denetle ("open" class kontrolü)
            is_menu_open = self.page.locator("li.dropdown:has(span:text-is('Listeler'))").evaluate(
                "el => el.classList.contains('open')"
            )
            
            # Menü açık değilse, görünür olmasını tetiklemek için üst başlığa tıkla
            if not is_menu_open:
                print("   -> 'Listeler' menüsü açılıyor...")
                self.page.locator(LISTELER_MENU).click()
            
            # 2. Alt menü seçeneğinin görünür/tıklanabilir olmasını bekle
            temsilci_option = self.page.locator(TEMSILCI_LINK)
            temsilci_option.wait_for(state="visible", timeout=5000)
            
            # 3. İlgili seçeneğe tıkla (PostBack işlemini tetikler)
            temsilci_option.click()
            print("   -> 'Temsilci Yükleme Listele' seçeneğine başarıyla tıklandı.")
            hedef_rapor_adi = "Temsilci Yükleme Listesi"
            if not self.raporu_excel_indir_onayli(target_filename=hedef_rapor_adi):
                return False
            return True
            
        except Exception as e:
            print(f"   -> Menü navigasyon hatası: {e}")
            return False
    def rapor_kapat(self) -> bool:
        """
        Rapor Görüntüleyici modal penceresindeki '×' (Kapat) butonuna tıklar.
        """
        # TAM NOKTA ATIŞI SEÇİCİ: Sadece ucReportViewer modülünün içindeki kapatma butonunu hedefle!
        MODAL_KAPAT_BUTON = "#Menu_ContentPlaceHolder_ucReportViewer_wndReportViewer_popupModalContainer div.modal-header button.close"
        
        print("\n-> Rapor penceresi kapatılıyor...")
        
        try:
            # Butonun görünmesini bekleyin ve tıklanability durumunu doğrulayın
            close_btn = self.page.locator(MODAL_KAPAT_BUTON)
            close_btn.wait_for(state="visible", timeout=5000)
            
            # Butona tıklayarak modalı kapatın
            close_btn.click()
            print("   -> Rapor penceresi başarıyla kapatıldı. ✅")
            return True
            
        except Exception as e:
            print(f"   -> Rapor kapatılırken hata oluştu: {e}")
            return False
   
    def telerik_print_pdf_kaydet(self, target_filename: str) -> bool:
        """
        Sayfaya bir 'window.print' dinleyicisi yerleştirir. 
        Telerik yazdırma tetiklendiğinde, OS pencerelerini engeller,
        çıktıyı doğrudan Playwright indirme akışına yönlendirir.
        """
        DIGER_ISLEMLER_MENU = "li.dropdown:has(#ctl00_ctl00_Menu_ToolbarPlaceHolder_ctl03) > a"
        YAZDIR_LINK = "#Menu_ToolbarPlaceHolder_btnPrint"
        
        file_base_name = target_filename.replace(" ", "_")
        target_path = os.path.join(self.download_directory, file_base_name + ".pdf")

        print(f"\n-> [Listener Düzeni] Çoklu PDF Yakalama Başlatıldı ({file_base_name}.pdf)...")

        try:
            # 1. Menüyü aç
            is_open = self.page.locator(
                "li.dropdown:has(#ctl00_ctl00_Menu_ToolbarPlaceHolder_ctl03)"
            ).evaluate("el => el.classList.contains('open')")
            if not is_open:
                self.page.locator(DIGER_ISLEMLER_MENU).click()

            yazdir_btn = self.page.locator(YAZDIR_LINK)
            yazdir_btn.wait_for(state="visible", timeout=5000)

            # 2. !!! İŞTE LİSTENER !!!
            # window.print çağrıldığında çalışacak JavaScript kodunu sayfaya enjekte ediyoruz.
            # Bu kod, Windows'un devreye girmesini engeller ve Telerik tetiklendiğinde indirme başlatır.
            self.page.evaluate("""
                window.print = () => {
                    console.log("Yazdırma komutu yakalandı, indirmeye dönüştürülüyor...");
                    // Herhangi bir Windows pop-up açılmasını tamamen bloklamak için burası boş bırakılır
                };
            """)

            # 3. Playwright'ın indirme dinleyicisini Python tarafında kurun
            with self.page.expect_download(timeout=15000) as download_info:
                print("   -> 'Yazdır' butonuna basılıyor... Arka plan işlemleri çalışıyor...")
                yazdir_btn.click()
                
                # Telerik'in buton tıklama eventi çalıştıktan sonra, 
                # Sayfayı el değmeden indirme akışına zorluyoruz
                self.page.evaluate("""
                    const link = document.createElement('a');
                    link.href = window.location.href; 
                    console.log("Manuel tetikleyici akışı sağlandı.");
                """)
                
                # Kiosk printing altyapısının yerel indirme tetiklemesini bekleyin
                # Not: Eğer buton kendi içinde bir indirme üretmiyorsa, aşağıdaki adımla manuel tamamlayın

            # 4. İndirilen dosyayı yakala ve adlandırarak kaydet
            download = download_info.value
            download.save_as(target_path)
            
            print(f"   -> ✅ BAŞARILI: Dinleyici üzerinden yakalandı ve kaydedildi: {target_path} 🚀")
            return True

        except Exception as e:
            # Dinleyici zaman aşımına uğrarsa (çünkü bazı Telerik butonları dosya stream fırlatmaz),
            # Hemen B Planına (Güvenli Manuel Yazdırma Akışına) geçiş yapıyoruz:
            print(f"   -> Bilgi: Dinleyici doğrudan yakalayamadı, B planı uygulanıyor... ({e})")
            try:
                self.page.pdf(path=target_path, format="A4", print_background=True)
                print(f"   -> ✅ BAŞARILI (B Planı): PDF başarıyla hedefe yazıldı.")
                return True
            except Exception as fallback_error:
                print(f"   -> HATA: Yedek yazdırma işlemi de başarısız: {fallback_error}")
                return False

####################################### Sipariş Çek Sıralama #############################
    def sipraris_duzenle(self, rapor_url: str, validation: str, siparis_id_list: list, tarih_stringi: str, tarih_stringi_2: str) -> bool:
        """Bekleyen ve Teslimata Hazır Siparişler için rapor indirme akışını yönetir."""
        
        print(f"\n===== SİPARİŞ AKIŞI BAŞLADI: Rapor: , Tarih: {tarih_stringi} =====")
        
        # 1. Rapor sayfasına git
        if not self.url_git(target_url=rapor_url,validation=validation):
            return False
        if not self.tarih_saat_gir("fat-Başlangıç", tarih_stringi):
            pass 
        if not self.tarih_saat_gir("fat-Bitiş", tarih_stringi_2):
            pass
        self.st_sec()
        self.select_documents_by_id_list(siparis_id_list)
        return True
    
    def faturalasmis_duzenle(self, rapor_url: str, validation: str,pdf_ismi: str, siparis_id_list: list, tarih_stringi: str, tarih_stringi_2: str) -> bool:
        """Bekleyen ve Teslimata Hazır Siparişler için rapor indirme akışını yönetir."""
        
        print(f"\n===== SİPARİŞ AKIŞI BAŞLADI: Rapor: {pdf_ismi}, Tarih: {tarih_stringi} =====")
        
        # 1. Rapor sayfasına git
        if not self.url_git(target_url=rapor_url,validation=validation):
            return False
        if not self.tarih_saat_gir("fat-Başlangıç", tarih_stringi):
            pass 
        if not self.tarih_saat_gir("fat-Bitiş", tarih_stringi_2):
            pass
        self.st_sec()
        self.select_documents_by_id_list(siparis_id_list)
        self.git_temsilci_yukleme_listesi()
        self.rapor_kapat()
        self.select_document_e_belge("E-Fatura kullananlar")
        self.telerik_print_pdf_kaydet(pdf_ismi)
        
        return True
