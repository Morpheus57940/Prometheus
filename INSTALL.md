# Guide d'installation Prometheus v6.4

## Windows — Je ne sais pas si j'ai Node.js

Ouvrez une fenêtre PowerShell (clic droit sur le bureau → "Ouvrir PowerShell") et tapez :

```powershell
node --version
```

- Si vous voyez `v20.x.x` ou supérieur → Node.js est installé, passez à "Compilation"
- Si vous voyez une erreur → téléchargez Node.js sur https://nodejs.org/ (bouton "LTS")

## Compilation depuis les sources

```bash
# 1. Cloner le dépôt
git clone https://github.com/morpheus-astro/prometheus.git
cd prometheus

# 2. Installer les dépendances (une seule fois)
npm install

# 3. Lancer en mode développement
npm start

# 4. Compiler pour Windows (crée setup .exe + portable .exe dans dist/)
npm run build:win

# 5. Compiler pour macOS (crée .dmg arm64 + x64 dans dist/)
npm run build:mac
```

## iPad — Installation PWA sans compilation

Aucun Node.js requis. Deux méthodes :

### Méthode 1 : GitHub Pages (recommandée)
1. Sur l'iPad, ouvrir Safari
2. Aller sur `https://morpheus-astro.github.io/prometheus/`
3. Bouton Partager (↑) → "Sur l'écran d'accueil" → Ajouter
4. L'icône Prometheus apparaît — plein écran, fonctionne hors ligne

### Méthode 2 : Serveur local (si pas de connexion internet)
```bash
# Sur votre PC, dans le dossier public/ du projet
cd public
python3 -m http.server 8080
# Sur l'iPad : Safari → http://[IP-de-votre-PC]:8080
```

## Résolution des problèmes courants

### "L'app ne s'ouvre pas sur macOS"
→ Clic droit sur Prometheus.app → Ouvrir → Ouvrir quand même
→ Réglages Système → Confidentialité → Général → Ouvrir quand même

### "ASIAIR non trouvé"
→ Vérifier que l'iPad et l'ASIAIR sont sur le même réseau WiFi
→ Trouver l'IP dans l'app ASIAIR officielle → ⚙ → Réseau
→ Dans Prometheus → section "Connexion" → entrer l'IP manuellement

### "GPS ne fonctionne pas sur iPad"
→ Réglages iPad → Confidentialité → Service de localisation → Safari → Toujours

### "Boussole ne fonctionne pas sur iPad"
→ Réglages iPad → Safari → Mouvement & orientation → Autoriser

