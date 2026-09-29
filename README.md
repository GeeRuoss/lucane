# Lucane : proposition de refonte

Site statique en français, 9 pages. Source publique métier : lucane.ch. Recherche documentée dans SOURCES.md.

## Travail local

- `npm ci`
- `npm run build`
- `npm run dev` : http://127.0.0.1:4318/lucane/

Pages HTML générées par build.mjs ; contenu commun dans site-data.mjs ; CSS et JS sans framework ; maison architecturale Three.js locale. Aucun appel externe au chargement. Accueil bureau dimensionné sur la fenêtre visible, titre plafonné à 76 px et contenu limité à 1 360 px. Sur mobile, la 3D réagit au toucher du visuel ; sur bureau, chargement après la première mise en page. Entrée animée de 4,2 secondes, puis mouvement lié au pointeur. Aucun bouton play/pause ni légende décorative. Réduction des mouvements et pause hors écran prises en compte.

Logo vectoriel en tracés : assets/logo.svg, logo-white.svg, logo-blue.svg. Police libre Manrope, licence dans assets/FONT-LICENSE.txt après build. `node logo.mjs` régénère les logos ; `node poster.mjs` régénère le rendu de repli depuis les mêmes géométries que la scène ; `node social.mjs` régénère l’image de partage.

## Prévisualisation

https://geeruoss.github.io/lucane/

Le workflow main publie uniquement dist sur GitHub Pages. Noindex explicite sur toutes les pages et sitemap vide : cet aperçu ne doit pas concurrencer le site officiel.

## Mise en service officielle à préparer après validation

Confirmer les textes, l’hébergement définitif, l’activité WhatsApp du mobile publié, la politique de traitement des demandes et le service analytics. Aucun outil d’audience activé ; l’événement local `lucane:conversion` ne transmet aucune donnée. E-mail et téléphone sont accessibles en complément.

La publication sur lucane.ch n’est pas faite. Pour une future version officielle, renseigner SITE_MODE=production SITE_ORIGIN=https://lucane.ch SITE_BASE=/ ; vérifier le sitemap et les canoniques, puis préparer les redirections 301 depuis les anciennes URLs PHP sur l’hébergeur retenu. Adapter les textes de confidentialité et les conditions à la version officielle. Les vérifications Search Console et l’indexation demandent l’accès du propriétaire.

Aucun tarif, avis, résultat technique ou accréditation n’est inventé. Le laboratoire béton cédé en 2024 ne figure pas dans l’offre actuelle.

## Direction visuelle, version 3

L’accueil utilise une sculpture abstraite de 23 lamelles. Les trois expertises possèdent chacune leur modèle : maison en strates, salle ouverte et relief. `node poster.mjs` régénère les quatre posters ; `node social.mjs` produit la carte de partage v3. `editorial.mjs` centralise les photos et textes complémentaires. Droits : voir CREDITS.md et la page Conditions.
