import pandas as pd
import os

# Charger le fichier CSV
df = pd.read_csv("194_utf8.csv", sep=";", encoding="utf-8-sig")

# Fonction générique pour splitter une colonne séparée par des virgules
def split_column(value):
    if pd.isna(value):
        return []
    # On s'assure que ce soit bien une chaîne, on split et on nettoie les espaces
    return [opt.strip() for opt in str(value).split(",") if opt.strip()]

# Colonnes à splitter
columns_to_split = ["serviceOptions", "keyword", "otherEmails"]

# Appliquer la transformation sur chaque colonne si elle existe
for col in columns_to_split:
    if col in df.columns:
        df[col] = df[col].apply(split_column)
    else:
        print(f"⚠️ Colonne '{col}' introuvable dans le CSV.")

# Définir le chemin de sortie (même dossier que le script)
output_path = os.path.join(os.path.dirname(__file__), "restaurants_clean.json")

# Sauvegarder le fichier JSON formaté
df.to_json(output_path, orient="records", force_ascii=False, indent=2)

# Afficher le résultat
print(f"✅ {len(df)} lignes exportées dans : {output_path}")
