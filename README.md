# Prometheus Astrophoto v6.4

**Application astrophotographie professionnelle**  
NexStar 6SE · ASIAIR · iPad PWA · Windows · macOS  
© 2026 Morpheus — Tous droits réservés

---

## Téléchargement

| Plateforme | Lien |
|---|---|
| Windows (installeur) | [Releases → Prometheus-Setup-*.exe](https://github.com/morpheus-astro/prometheus/releases/latest) |
| Windows (portable) | [Releases → Prometheus-*-Portable.exe](https://github.com/morpheus-astro/prometheus/releases/latest) |
| macOS Apple Silicon | [Releases → Prometheus-*-arm64.dmg](https://github.com/morpheus-astro/prometheus/releases/latest) |
| macOS Intel | [Releases → Prometheus-*-x64.dmg](https://github.com/morpheus-astro/prometheus/releases/latest) |
| iPad / iOS | Ouvrir [la PWA](https://morpheus-astro.github.io/prometheus/) dans Safari → Partager → Sur l'écran d'accueil |
| Android | Ouvrir [la PWA](https://morpheus-astro.github.io/prometheus/) dans Chrome → Installer |

---

## Fonctionnalités v6.4

### Observation
- **Tableau de bord** — Live View miniature, session en cours, statuts temps réel
- **Live View** — Aperçu image ASIAIR, histogramme RVB, guidage PHD2, plein écran
- **Météo live** — Open-Meteo, seeing Antoniadi, transparence, heure par heure
- **Catalogue** — 110 474 objets NGC/IC/Messier + personnalisés
- **Planificateur** — Timeline nuit, Goto ASIAIR avec confirmation + Plate Solve
- **Carte du ciel HD** — 200+ objets, étoiles mag 8.5, filtres, tap → Goto

### GPS & Navigation
- **GPS iPad** — Position réelle via `navigator.geolocation`, LST, heure sidérale
- **Lieux nommés** — Sauvegarder jusqu'à 12 sites d'observation avec nom
- **Boussole iPad** — `DeviceOrientationEvent.requestPermission()`, déclinaison magnétique
- **Table équatoriale** — Procédure dédiée NexStar 6SE, 9 étapes, calcul rayon segment

### ★ Mes équipements (NEW v6.4)
- Ajouter **tubes** (réfracteur, Newton, SCT, Mak, Cassegrain, RC, fait maison…)
- Ajouter **caméras** refroidies (pixel, capteur, couleur/mono, refroidissement)
- Ajouter **APN** (pixel, capteur, modification Ha)
- Ajouter **montures** (type, charge, GoTo, motorisation)
- Ajouter **lunettes de guidage** (focale, diamètre, caméra guide)
- Ajouter **correcteurs** (facteur, compatibilité)
- Ajouter **accessoires** (filtres, EAF, flat panel, etc.)
- **Import/Export JSON** — synchronisation entre iPad et PC
- **Contribuer** — proposer sur GitHub Issues pour enrichir la base commune

### Matériel
- Optique — 60+ instruments référencés + les vôtres
- Guidage — TS Optics TSL60D, Svbony SV106, WO UniGuide, Askar ACL200…
- Montures — Celestron NexStar, Sky-Watcher, ZWO AM3/AM5, iOptron, Losmandy…
- Toggle Table Équatoriale dans l'optique (rotation de champ nulle)

### Acquisition
- **Prise de vue manuelle** — curseurs + saisie exacte (pose, ISO, nb poses)
- Suggestions intelligentes (point de départ) + notes pédagogiques
- **DOF & Stockage** — SSD externe / Carte SD / Les deux
- **3-Sigma** — kappa-sigma clipping interactif

### Connexion
- **Détection automatique réseau** — Box WiFi (mode Station) ou Hotspot ASIAIR direct
- Scanner IP automatique (192.168.1.x, 192.168.0.x, 10.0.x)
- Basculement automatique si changement de réseau

---

## Installation rapide

### Windows
```
1. Télécharger Prometheus-Setup-6.4.0.exe
2. Double-cliquer → Suivant → Installer
3. Lancer depuis le bureau
```

### macOS
```
1. Télécharger le .dmg correspondant à votre Mac (arm64 = Apple Silicon, x64 = Intel)
2. Ouvrir le .dmg → Glisser Prometheus vers Applications
3. Premier lancement : Clic droit → Ouvrir (contournement Gatekeeper)
```

### iPad (PWA)
```
1. Connecter l'iPad au même WiFi que l'ASIAIR (ou au réseau ASIAIR_XXXXX)
2. Ouvrir Safari → https://morpheus-astro.github.io/prometheus/
3. Bouton Partager (↑) → "Sur l'écran d'accueil" → Ajouter
4. Lancer depuis l'icône → plein écran, fonctionne hors ligne
```

---

## Compilation locale

### Prérequis
- **Node.js 20+** — https://nodejs.org/
- **Git** — https://git-scm.com/

### Commandes
```bash
git clone https://github.com/morpheus-astro/prometheus.git
cd prometheus
npm install
npm start              # Lancer en développement
npm run build:win      # Compiler Windows (setup + portable)
npm run build:mac      # Compiler macOS (dmg arm64 + x64)
npm run build:all      # Tout compiler
```

Les fichiers compilés apparaissent dans le dossier `dist/`.

### Vérifier Node.js
```bash
node --version   # doit afficher v20.x.x ou supérieur
npm --version    # doit afficher 10.x.x ou supérieur
```

---

## Architecture

```
prometheus/
├── src/
│   ├── main.js          # Electron — process principal
│   └── preload.js       # Bridge contextIsolation
├── public/
│   ├── index.html       # Application complète (HTML/CSS/JS)
│   ├── manifest.json    # PWA manifest
│   └── sw.js            # Service Worker (offline)
├── assets/
│   ├── icon.ico         # Icône Windows
│   ├── icon.icns        # Icône macOS
│   └── entitlements.mac.plist
├── .github/workflows/
│   └── build.yml        # CI/CD GitHub Actions
├── package.json         # Config Electron + electron-builder
└── README.md
```

---

## Contribuer

1. **Signaler un bug** → [Issues](https://github.com/morpheus-astro/prometheus/issues)
2. **Proposer un équipement** → Issues → template "equipment"
3. **Pull Request** → Fork → branche → PR sur `main`

---

## Licence

© 2026 Morpheus — Tous droits réservés  
Voir [LICENSE](LICENSE) pour les conditions d'utilisation.
