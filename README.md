# Lucane : proposition de refonte

Site statique en français, 9 pages. Source publique métier : lucane.ch. Recherche documentée dans SOURCES.md.

## Travail local

- `npm ci`
- `npm run build`
- `npm run dev` : http://127.0.0.1:4318/lucane/

Pages HTML générées par build.mjs ; contenu commun dans site-data.mjs ; CSS et JS sans framework ; scènes Three.js locales. Aucun appel externe au chargement. Accueil sur une fenêtre visible, titre plafonné à 44 px et scène limitée à 1 360 px. Sur mobile, le poster est immédiat et la 3D se charge au premier toucher. Haut-parleur sur trépied : glisser horizontalement à la souris ou au toucher pour tourner autour ; flèches du clavier et touche Début disponibles. Défilement vertical préservé. Rendu uniquement lors des interactions et changements de taille ; arrêt hors écran. Image de remplacement si WebGL ou le modèle ne charge pas. Aucun bouton play/pause ni animation automatique.

Logo vectoriel en tracés : assets/logo.svg, logo-white.svg, logo-blue.svg. Police libre Manrope, licence dans assets/FONT-LICENSE.txt après build. `node logo.mjs` régénère les logos ; `node poster.mjs` régénère le rendu de repli depuis les mêmes géométries que la scène ; `node social.mjs` régénère l’image de partage.

## Prévisualisation

https://geeruoss.github.io/lucane/

Le workflow main publie uniquement dist sur GitHub Pages. Noindex explicite sur toutes les pages et sitemap vide : cet aperçu ne doit pas concurrencer le site officiel.

## Mise en service officielle à préparer après validation

Confirmer les textes, l’hébergement définitif, l’activité WhatsApp du mobile publié, la politique de traitement des demandes et le service analytics. Aucun outil d’audience activé ; l’événement local `lucane:conversion` ne transmet aucune donnée. E-mail et téléphone sont accessibles en complément.

La publication sur lucane.ch n’est pas faite. Pour une future version officielle, renseigner SITE_MODE=production SITE_ORIGIN=https://lucane.ch SITE_BASE=/ ; vérifier le sitemap et les canoniques, puis préparer les redirections 301 depuis les anciennes URLs PHP sur l’hébergeur retenu. Adapter les textes de confidentialité et les conditions à la version officielle. Les vérifications Search Console et l’indexation demandent l’accès du propriétaire.

Aucun tarif, avis, résultat technique ou accréditation n’est inventé. Le laboratoire béton cédé en 2024 ne figure pas dans l’offre actuelle.

## Direction visuelle, version 4

Haut-parleur omnidirectionnel fourni pour le projet, posé sur un trépied à trois pieds. Accueil minimal, fond clair, bleu Lucane #172fc5, liens répartis autour du modèle. Les trois expertises conservent leurs compositions abstraites : maison en strates, salle ouverte et relief. `node poster.mjs` régénère leurs posters ; `poster-speaker.py` régénère le poster du haut-parleur avec Blender et Pillow. `node social.mjs` produit la carte de partage v4. `editorial.mjs` centralise les photos et textes complémentaires. Droits : voir CREDITS.md et la page Conditions.
