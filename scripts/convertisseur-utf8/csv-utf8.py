import pandas as pd

# Fichiers
input_csv = "xxx.csv"
output_csv = "xxx_utf8.csv" # Fichier de sortie avec encodage UTF-8

# Lire le CSV avec séparateur point-virgule
df = pd.read_csv(input_csv, sep=';', encoding='utf-8', engine='python')

# Réécrire en UTF-8 avec BOM pour Excel
df.to_csv(output_csv, sep=';', index=False, encoding='utf-8-sig')

print(f"CSV corrigé avec accents : {output_csv}")
