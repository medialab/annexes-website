# éditions annexes

[![Build And Deploy (With PDF Sync)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml/badge.svg)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml)

Site web des éditions annexes — projet éditorial du medialab Sciences Po.

## Ajouter une publication

1. **Déposer le PDF** dans le dossier `static/pdfs/`
2. **Pousser sur `main`** — la CI détecte le nouveau fichier, génère les pages et vignettes, crée l'entrée dans la base de données, et déploie le site automatiquement

> Le titre, les auteurs·rices, la date et les mots-clés sont automatiquement extraits des métadonnées du PDF (XMP). Si le PDF n'a pas de métadonnées, le nom du fichier sert de titre.

### Via l'interface GitHub

1. Aller sur [github.com/medialab/editions-annexes](https://github.com/medialab/editions-annexes)
2. Naviguer dans `static/pdfs/` → **Add file** → **Upload files**
3. Glisser-déposer le PDF → **Commit changes** (sur `main`)
4. Le déploiement démarre automatiquement. Vérifier le status dans l'onglet **Actions**

### Structure des assets générés

```
src/lib/media/editions/{slug}/
├── pages/              # JPEGs (une par page)
├── canvasElements/     # Vignette de couverture
└── images/             # Gallery (à ajouter manuellement si besoin)
```

### Ajouter des images de gallery

Après le déploiement automatique, placer les images dans `src/lib/media/editions/{slug}/images/` et pousser à nouveau.

## Développement local

```bash
bun install
bun run dev
```

### Scripts utiles

| Commande | But |
|----------|-----|
| `bun scripts/process-pdf.js` | Synchroniser les PDFs avec la base de données |
| `bun test` | Tester le pipeline PDF |
| `bun run build` | Build de production |

Le site est automatiquement déployé sur GitHub Pages à chaque push sur `main`. Voir `.github/workflows/deploy.yml`.
