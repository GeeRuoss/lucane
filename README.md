# Lucane : proposition de refonte

Site statique en français, 9 pages. Source publique métier : lucane.ch. Recherche documentée dans SOURCES.md.

## Travail local

- `npm ci`
- `npm run build`
- `npm run dev` : http://127.0.0.1:4318/lucane/

Pages HTML générées par build.mjs ; contenu commun dans site-data.mjs ; CSS et JS sans framework ; scènes Three.js locales. Aucun appel externe au chargement. Accueil sur une fenêtre visible, titre plafonné à 48 px et scène limitée à 1 360 px. La scène et le modèle sont préchargés dès l’ouverture sur ordinateur et téléphone. Le poster est réservé au repli sans JavaScript ou en cas d’échec WebGL ; aucune image différente ne précède la scène. Rotation lente à l’arrivée, arrêt dès la manipulation et respect de la réduction des mouvements. Haut-parleur sur trépied : glisser horizontalement à la souris ou au toucher pour tourner autour ; flèches du clavier et touche Début disponibles. Défilement vertical préservé. Rotation limitée à environ 30 images par seconde ; arrêt hors écran et dans un onglet masqué. Image de remplacement si WebGL ou le modèle ne charge pas. Aucun bouton play/pause décoratif.

Logo vectoriel en tracés : assets/logo.svg, logo-white.svg, logo-blue.svg. Police libre Manrope, licence dans assets/FONT-LICENSE.txt après build. `node logo.mjs` régénère les logos ; `node poster.mjs` régénère le rendu de repli depuis les mêmes géométries que la scène ; `node social.mjs` régénère l’image de partage.

## Prévisualisation

https://geeruoss.github.io/lucane/

Le workflow main publie uniquement dist sur GitHub Pages. Noindex explicite sur toutes les pages et sitemap vide : cet aperçu ne doit pas concurrencer le site officiel.

## Mise en service officielle à préparer après validation

Confirmer les textes, l’hébergement définitif, l’activité WhatsApp du mobile publié, la politique de traitement des demandes et le service analytics. Aucun outil d’audience activé ; l’événement local `lucane:conversion` ne transmet aucune donnée. E-mail et téléphone sont accessibles en complément.

La publication sur lucane.ch n’est pas faite. Pour une future version officielle, renseigner SITE_MODE=production SITE_ORIGIN=https://lucane.ch SITE_BASE=/ ; vérifier le sitemap et les canoniques, puis préparer les redirections 301 depuis les anciennes URLs PHP sur l’hébergeur retenu. Adapter les textes de confidentialité et les conditions à la version officielle. Les vérifications Search Console et l’indexation demandent l’accès du propriétaire.

Aucun tarif, avis, résultat technique ou accréditation n’est inventé. Le laboratoire béton cédé en 2024 ne figure pas dans l’offre actuelle.

## Direction visuelle, version 4

Haut-parleur omnidirectionnel fourni pour le projet, posé sur un trépied à trois pieds. Accueil minimal, fond clair, bleu Lucane #172fc5, liens répartis autour du modèle sur ordinateur. Sur téléphone, modèle agrandi et navigation tactile en deux colonnes sous la scène. Les trois expertises conservent leurs compositions abstraites : maison en strates, salle ouverte et relief. `node poster.mjs` régénère leurs posters ; `poster-speaker.py` régénère le poster du haut-parleur avec Blender et Pillow. `node social.mjs` produit la carte de partage v4. `editorial.mjs` centralise les photos et textes complémentaires. Droits : voir CREDITS.md et la page Conditions.

## Corrections du 19 octobre 2026

Textes du bureau et des trois expertises actualisés selon le retour client. Libellé « Bruit environnemental » partout. Suppression des bandeaux de sollicitation, du bloc approche et des sections avec la photo de vallée. Bandeau illustratif avec panneau perforé et courbes sans données de mesure. Lucane vectoriel animé au pied des pages, définition et traductions accessibles au survol, au clavier et au toucher ; mouvements réduits respectés. Sources pour le vocabulaire : https://gd.eppo.int/taxon/LUCACE et https://www.karch.ch/fr/faune-de-suisse/insectes/coleopteres/aide-de-distinction-lucane-cerf-volant-et-petite-biche. Carte de partage v4 conservée : identité et haut-parleur principal inchangés.

20 octobre : le panneau perforé et les courbes décoratives sont réunis dans le pied de page de contact, commun aux neuf pages. Fond bleu, panneau clair en perspective et carte graphique superposée. Coordonnées directes et lien vers le formulaire ; ancien bandeau isolé de l’accueil retiré. Aucun graphique ne représente des mesures réelles. La scène d’accueil, le lucane animé et la carte de partage restent identiques.

### Références Florence et essai 3D du 20 octobre

Le bas des pages reprend la tôle sombre perforée transmise par Florence et des courbes de fréquence inspirées de son document. Les cinq originaux restent dans `../references-privees/florence-2026-10-20/` ; seule une image optimisée est publiée.

Page de travail `essai-lucane/`, sans ajout au menu : première sculpture 3D du lucane noir, rotation à la souris, au doigt et au clavier. Le déplacement vertical tactile fait défiler la page. Chargement de ce modèle et de son viewer uniquement sur cette page ; accueil et icône existants conservés. Modèle GLB d’environ 390 Ko, image de repli si WebGL indisponible. Volumes interprétés à partir de la photo, à valider avant intégration au site. Source et rendu haute résolution dans `../modelisation-lucane/`. Le modèle est statique, sans animation de marche.
