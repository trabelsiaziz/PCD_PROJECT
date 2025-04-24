import time
import os
import textwrap

# Configuration
buffer_file = "buffer.txt"  # Fichier d'entrée
output_file = "sous_titre.txt"  # Fichier lu par OBS
mot_delay = 0.6  # Délai entre chaque mot (secondes)
affichage_duree = 4  # Durée d'affichage en secondes avant effacement
mots_par_affichage = 5  # Nombre de mots à afficher à la fois

def afficher_et_effacer(texte):
    """Affiche le texte puis l'efface après un délai"""
    with open(output_file, "w", encoding="utf-8") as f_out:
        f_out.write(texte)
    time.sleep(affichage_duree)
    with open(output_file, "w", encoding="utf-8") as f_out:
        f_out.write("")

last_text = ""

try:
    while True:
        if os.path.exists(buffer_file):
            with open(buffer_file, "r", encoding="utf-8") as f:
                content = f.read().strip()

            if content != last_text:
                print(f"🆕 Nouveau contenu détecté : {content}")
                words = content.split()
                
                # Traiter par groupes de mots
                for i in range(0, len(words), mots_par_affichage):
                    groupe_mots = words[i:i+mots_par_affichage]
                    texte_a_afficher = " ".join(groupe_mots)
                    
                    print(f"➡️ Affichage : {texte_a_afficher}")
                    afficher_et_effacer(texte_a_afficher)
                    
                    # Effacer les mots déjà affichés du buffer
                    remaining_words = words[i+mots_par_affichage:]
                    with open(buffer_file, "w", encoding="utf-8") as f:
                        f.write(" ".join(remaining_words))

                last_text = ""

        time.sleep(0.1)

except KeyboardInterrupt:
    print("🛑 Script arrêté")
    # Nettoie le fichier à la sortie
    with open(output_file, "w", encoding="utf-8") as f_out:
        f_out.write("")