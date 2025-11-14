from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import json
import time
import re
import html
import os

# ---------- CONFIG ----------
types_restaurants = [
    "restaurant italien",
    "pizzeria",
    "bistrot",
    "brasserie",
    "restaurant végétarien",
    "restaurant vegan",
    "restaurant indien",
    "restaurant japonais",
    "sushi",
    "crêperie",
    "burger",
    "restaurant chinois",
    "restaurant thaïlandais",
    "cuisine libanaise",
    "café",
    "boulangerie-pâtisserie",
    "traiteur",
    "poissonnerie",
    "steakhouse"
]  # ajouter d'autres types si besoin

villes = [
    "Paris",
    "Le Plessis-Robinson",
    "Boulogne-Billancourt",
    "Issy-les-Moulineaux",
    "Neuilly-sur-Seine",
    "Versailles",
    "Rueil-Malmaison",
    "Suresnes",
    "Nanterre",
    "Levallois-Perret",
    "Montrouge",
    "Châtenay-Malabry",
    "Fontenay-aux-Roses",
    "Lyon",
    "Marseille",
    "Lille",
    "Nice",
    "Bordeaux",
    "Toulouse",
    "Nantes",
    "Strasbourg",
    "Montpellier",
    "Grenoble"
]  # ajouter d'autres villes si besoin
pause = 1  # secondes d’attente entre actions
# ----------------------------

DATA_FILE = "restaurants.json"

# --- Options Chrome ---
chrome_options = Options()
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)
chrome_options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/119.0.0.0 Safari/537.36"
)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
wait = WebDriverWait(driver, 2)

# Charger données existantes et construire l'ensemble des liens de partage uniques
data = []
existing_links = set()
if os.path.exists(DATA_FILE):
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f) or []
            for item in data:
                lp = item.get("lien_partage")
                if lp:
                    existing_links.add(lp)
    except Exception as e:
        print("Impossible de charger restaurants.json:", e)
        data = []
        existing_links = set()

def safe_text(xpath, context=None):
    try:
        context = context or driver
        el = context.find_elements(By.XPATH, xpath)
        return el[0].text.strip() if el else ""
    except Exception:
        return ""

def safe_attr(xpath, attr, context=None):
    try:
        context = context or driver
        el = context.find_elements(By.XPATH, xpath)
        return el[0].get_attribute(attr).strip() if el else None
    except Exception:
        return None

try:
    for type_restaurant in types_restaurants:
        for ville in villes:
            query = f"{type_restaurant} {ville}"
            print(f"\nRecherche : {query}")
            driver.get("https://www.google.com/")
            time.sleep(pause)

            # --- Pop-up cookies ---
            try:
                time.sleep(1)
                iframes = driver.find_elements(By.TAG_NAME, "iframe")
                if iframes:
                    driver.switch_to.frame(iframes[0])
                refuse_button = wait.until(EC.element_to_be_clickable((
                    By.XPATH,
                    "//button//div[text()='Tout refuser' or text()='Refuser tout']"
                )))
                refuse_button.click()
                print("Pop-up cookies : 'Tout refuser' cliqué.")
                driver.switch_to.default_content()
                time.sleep(2)
            except Exception:
                driver.switch_to.default_content()
                print("Aucun pop-up de consentement détecté ou déjà refusé.")

            # --- Recherche Google ---
            search_box = wait.until(EC.presence_of_element_located((By.NAME, "q")))
            search_box.send_keys(query)
            search_box.send_keys(Keys.RETURN)
            time.sleep(pause)

            # --- Cliquer sur "Voir plus de lieux" ---
            try:
                voir_plus = wait.until(EC.element_to_be_clickable((
                    By.XPATH, "//span[text()='Lieux']"
                )))
                driver.execute_script("arguments[0].click();", voir_plus)
                print("Bouton 'Lieux' cliqué.")
            except Exception:
                print("Bouton 'Lieux' non trouvé, tentative de lien Maps direct.")
                try:
                    maps_link = wait.until(EC.element_to_be_clickable((
                        By.XPATH, "//a[contains(@href,'maps.google')]"
                    )))
                    driver.execute_script("arguments[0].click();", maps_link)
                except Exception:
                    print("Impossible d’ouvrir Google Maps pour cette recherche.")
                    continue

            # --- Attente du chargement de Maps ---
            wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cXedhc")))
            time.sleep(1)

            # --- Parcours des cartes ---
            cards = driver.find_elements(By.CLASS_NAME, "cXedhc")
            print(f"{len(cards)} cartes trouvées ")

            for card in cards:
                try:
                    # --- Cliquer sur la carte pour détails ---
                    title = card.find_element(By.CLASS_NAME, "OSrXXb")
                    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", title)
                    time.sleep(1)
                    driver.execute_script("arguments[0].click();", title)
                    time.sleep(3)

                    # --- Infos supplémentaires après clic ---
                    nom = safe_text("//div[contains(@class, 'RorkHe KCmuYb  indIKd')]//h3[contains(@class,'BK5CCe  cS4Vcb-pGL6qe-fwJd0c')]")
                    # récupérer aria-label de la div dHX2k et nettoyer "Note :" et " sur 5"
                    aria = safe_attr(".//div[contains(@class,'dHX2k')]", "aria-label", context=card)
                    if not aria:
                        aria = safe_attr("//div[contains(@class,'dHX2k')]", "aria-label")
                    if aria:
                        # enlever préfixe "Note :" (variantes) et suffixe " sur 5" ou "/5"
                        note = re.sub(r'^(?:\s*Note\s*:?\s*)', '', aria, flags=re.I)
                        note = re.sub(r'\s*(?:sur|/)\s*5(?:[.,]\d+)?\s*$', '', note, flags=re.I)
                        note = note.strip()
                    else:
                        note = ""
                    nombre_avis = safe_attr(".//div[contains(@class,'leIgTe')]", "aria-label", context=card)
                    if not nombre_avis:
                        nombre_avis = safe_attr("//div[contains(@class,'Ty81De nOOkrb lPrPpb')]//div[contains(@class,'leIgTe')]", "aria-label") or ""
                    # retirer un éventuel " avis" (y compris avec espaces insécables) à la fin
                    if nombre_avis:
                        nombre_avis = re.sub(r'[\s\u00A0]*avis$', '', nombre_avis, flags=re.I).strip()
                    # fourchette de prix (ne conserver que si contient '€')
                    fourchette_prix = ""
                    try:
                        # chercher d'abord dans la carte
                        fourchette_prix = safe_text(".//span[contains(text(),'€')]", context=card)
                        if not fourchette_prix:
                            # chercher dans le panneau de détails global
                            fourchette_prix = safe_text("//span[contains(text(),'€')]")
                        if fourchette_prix and "€" not in fourchette_prix:
                            fourchette_prix = ""
                    except Exception:
                        fourchette_prix = ""
                    lien_reservation_href = safe_attr("//a[contains(@class,'K9ZSQ') and contains(@href,'reserve')]", "href")
                    lien_site_href = safe_attr("//a[contains(@class,'n1obkb')]", "href")
                    telephone = safe_attr("//a[contains(@jsaction,'F75qrd')]", "data-phone-number")

                    lien_partage_href = None
                    try:
                        # Cherche d'abord dans la carte
                        divs = card.find_elements(By.XPATH, ".//div[@jscontroller='XHXkqb' and @data-ed]")
                        if not divs:
                            # sinon chercher globalement dans la page
                            divs = driver.find_elements(By.XPATH, "//div[@jscontroller='XHXkqb' and @data-ed]")

                        for div in divs:
                            data_ed = div.get_attribute("data-ed")
                            if not data_ed:
                                continue

                            decoded = html.unescape(data_ed)
                            match = re.search(r'https://[^\s\",]+', decoded)
                            if match:
                                lien_partage_href = match.group(0)
                                break
                    except Exception as e:
                        print("Erreur extraction lien partage :", e)

                    # adresse
                    adresse = safe_text("//div[contains(@class,'F2yIXb')]//span")
                    if not adresse or not nom:
                        try:
                            # chercher la div cliquable dans la carte (ou globalement si non trouvée)
                            el = card.find_elements(By.XPATH, ".//div[contains(@class,'n1obkb') and contains(@class,'mI8Pwc')]")
                            if not el:
                                el = driver.find_elements(By.XPATH, "//div[contains(@class,'n1obkb') and contains(@class,'mI8Pwc')]")
                            if el:
                                driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el[0])
                                time.sleep(0.5)
                                driver.execute_script("arguments[0].click();", el[0])
                                time.sleep(5)

                                try:
                                    # input dont l'aria-label commence par "Desination" (ou "Destination")
                                    input_el = driver.find_element(By.XPATH, "//input[starts-with(@aria-label,'Desination') or starts-with(@aria-label,'Destination')]")
                                    aria = input_el.get_attribute("aria-label") or ""
                                    # enlever le préfixe "Desination"/"Destination" + séparateurs éventuels pour ne garder que la suite
                                    adresse = re.sub(r'^(Desination|Destination)\s*[:—\-–]?\s*', '', aria, flags=re.I).strip() # extraire l'adresse de l'aria-label en enlevant le préfixe

                                    if not nom :
                                        nom = adresse.split(",")[0].strip()
                                except Exception:
                                    # si l'input n'est pas trouvé, ne rien faire
                                    pass
                        except Exception:
                            pass

                    print(f"Traitement : {nom if nom else '(sans nom)'}")

                    # --- Vérification doublon avant ajout ---
                    is_duplicate = False
                    if lien_partage_href:
                        if lien_partage_href in existing_links:
                            print("Déjà présent dans le fichier (même lien de partage) — ajout ignoré.")
                            is_duplicate = True
                    else:
                        # Vérification de secours si pas de lien de partage : même nom+adresse+ville
                        for existing in data:
                            if (existing.get("nom") and existing.get("adresse") and existing.get("ville")
                                    and nom and adresse and ville
                                    and existing.get("nom") == nom
                                    and existing.get("adresse") == adresse
                                    and existing.get("ville") == ville):
                                print("Déjà présent dans le fichier (même nom+adresse+ville) — ajout ignoré.")
                                is_duplicate = True
                                break

                    if not is_duplicate:
                        record = {
                            "nom": nom,
                            "note": note,
                            "adresse": adresse,
                            "ville": ville,
                            "categorie": type_restaurant,
                            "nombre_avis": nombre_avis,
                            "prix": fourchette_prix,
                            "lien_reservation": lien_reservation_href,
                            "lien_site": lien_site_href,
                            "telephone": telephone,
                            "lien_partage": lien_partage_href
                        }
                        data.append(record)
                        if lien_partage_href:
                            existing_links.add(lien_partage_href)

                        # --- Sauvegarde incrémentale ---
                        try:
                            with open(DATA_FILE, "w", encoding="utf-8") as f:
                                json.dump(data, f, ensure_ascii=False, indent=4)
                        except Exception as e:
                            print("Erreur lors de la sauvegarde :", e)
                    else:
                        print("Saut de l'ajout (doublon détecté).")

                    time.sleep(3)
                except Exception as e:
                    print(f"Erreur sur un restaurant : {type(e).__name__} → {e}")

                finally:
                    # revenir à la liste
                    try:
                        driver.back()
                        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "cXedhc")))
                    except Exception:
                        pass

finally:
    driver.quit()
    print("\nDonnées sauvegardées dans restaurants.json")
