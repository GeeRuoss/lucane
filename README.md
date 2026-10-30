# Lucane : site vitrine

Site statique en français, 10 pages dont une étude 3D hors menu. Source publique métier : lucane.ch. Recherche documentée dans SOURCES.md.

## Travail local

- `npm ci`
- `npm run build`
- `npm run dev` : http://127.0.0.1:4318/lucane/

Pages HTML générées par build.mjs ; contenu commun dans site-data.mjs ; CSS et JS sans framework ; scènes Three.js locales. Aucun appel externe au chargement. Accueil cadré sur une fenêtre visible, titre plafonné à 48 px et composition limitée à 1 360 px. La scène et le modèle sont préchargés sur ordinateur et téléphone. Une entrée de 3,2 secondes révèle le panneau et dessine la courbe derrière le haut-parleur, puis s’arrête. Réaction discrète au pointeur, glissement horizontal et flèches du clavier pour changer le point de vue ; Début rétablit la vue. L’amplitude est limitée pour garder les panneaux à l’arrière. Défilement vertical préservé, réduction des mouvements respectée, rendu limité à environ 30 images/s et arrêté hors écran ou dans un onglet masqué. Le poster correspondant à la scène est réservé au repli sans JavaScript ou en cas d’échec WebGL ; aucune image différente ne précède la 3D. Aucun bouton ou texte décoratif ajouté.

Logo vectoriel en tracés : assets/logo.svg, logo-white.svg, logo-blue.svg. Police libre Manrope, licence dans assets/FONT-LICENSE.txt après build. `node logo.mjs` régénère les logos ; `node poster.mjs` régénère le rendu de repli depuis les mêmes géométries que la scène ; `node social.mjs` régénère l’image de partage.

## Prévisualisation

https://geeruoss.github.io/lucane/

Le workflow main publie uniquement dist sur GitHub Pages. Noindex explicite sur toutes les pages et sitemap vide : cet aperçu ne doit pas concurrencer le site officiel.

## Publication officielle sur lucane.ch

La mise en ligne sur le domaine officiel a été autorisée le 30 octobre 2026. L’hébergement Ex2 existant est conservé. `npm run build:production` génère `dist-production/` avec les liens à la racine de https://lucane.ch/, les canoniques officielles, huit URL dans le sitemap et les pages publiques indexables. La page 404 et l’étude 3D restent en noindex. Le build de l’aperçu GitHub demeure séparé dans `dist/`, sans indexation.

`legal.mjs` adapte les informations d’édition et d’hébergement à chaque destination. `deploy/production.htaccess`, copié uniquement dans le build officiel, privilégie l’accueil HTML, redirige les anciennes pages PHP, normalise HTTPS et www et fournit une vraie page 404. Les anciens PDF conservent leurs adresses. Avant chaque remplacement, sauvegarder les fichiers existants hors de la racine publique, envoyer les assets et pages internes, puis l’accueil et la configuration. Les accès et rapports de déploiement restent hors du dépôt public.

Aucun outil d’audience activé. L’ancien identifiant Universal Analytics du site historique n’est pas repris. E-mail et téléphone restent directement accessibles. Les vérifications Search Console et la mesure d’audience nécessitent les accès ou l’identifiant du propriétaire. La présence effective du mobile sur WhatsApp n’a pas été vérifiée par envoi de message.

Aucun tarif, avis, résultat technique ou accréditation n’est inventé. Le laboratoire béton cédé en 2024 ne figure pas dans l’offre actuelle.

## Direction visuelle, version 5

Haut-parleur omnidirectionnel fourni pour le projet, posé sur un trépied à trois pieds. Accueil minimal, fond clair, bleu Lucane #172fc5, liens répartis autour du modèle sur ordinateur. Sur téléphone, modèle agrandi et navigation tactile en deux colonnes sous la scène. Les trois expertises conservent leurs compositions abstraites : maison en strates, salle ouverte et relief. `node poster.mjs` régénère leurs posters ; `poster-speaker.py` régénère le poster du haut-parleur avec Blender et Pillow. `node social.mjs` produit la carte de partage v5 depuis le poster de la composition complète ; le build la régénère aussi. `editorial.mjs` centralise les photos et textes complémentaires. Droits : voir CREDITS.md et la page Conditions.

## Corrections du 19 octobre 2026

Textes du bureau et des trois expertises actualisés selon le retour client. Libellé « Bruit environnemental » partout. Suppression des bandeaux de sollicitation, du bloc approche et des sections avec la photo de vallée. Bandeau illustratif avec panneau perforé et courbes sans données de mesure. Lucane vectoriel animé au pied des pages, définition et traductions accessibles au survol, au clavier et au toucher ; mouvements réduits respectés. Sources pour le vocabulaire : https://gd.eppo.int/taxon/LUCACE et https://www.karch.ch/fr/faune-de-suisse/insectes/coleopteres/aide-de-distinction-lucane-cerf-volant-et-petite-biche. Carte de partage v4 conservée : identité et haut-parleur principal inchangés.

20 octobre : le panneau perforé et les courbes décoratives sont réunis dans le pied de page de contact, commun aux neuf pages. Fond bleu, panneau clair en perspective et carte graphique superposée. Coordonnées directes et lien vers le formulaire ; ancien bandeau isolé de l’accueil retiré. Aucun graphique ne représente des mesures réelles. La scène d’accueil, le lucane animé et la carte de partage restent identiques.

### Références Florence et essai 3D du 20 octobre

Le bas des pages reprend la tôle sombre perforée transmise par Florence et des courbes de fréquence inspirées de son document. Les cinq originaux restent dans `../references-privees/florence-2026-10-20/` ; seule une image optimisée est publiée.

Page de travail `essai-lucane/`, sans ajout au menu : première sculpture 3D du lucane noir, rotation à la souris, au doigt et au clavier. Le déplacement vertical tactile fait défiler la page. Chargement de ce modèle et de son viewer uniquement sur cette page ; accueil et icône existants conservés. Modèle GLB d’environ 390 Ko, image de repli si WebGL indisponible. Volumes interprétés à partir de la photo, à valider avant intégration au site. Source et rendu haute résolution dans `../modelisation-lucane/`. Le modèle est statique, sans animation de marche.

La V2 de l’étude reprend les proportions du spécimen mâle du Muséum de Toulouse : tête anguleuse et large, mandibules à deux grandes dents et denticules, antennes coudées à massue en peigne, pattes à cinq tarsomères, tibias dentés, griffes et dessous segmenté. GLB `lucane-anatomique-v2.glb`, environ 1,7 Mo avec cartes de rugosité et normales synthétiques. Trois rendus de contrôle et source `lucane-anatomique-v2.blend` dans `../modelisation-lucane/`. Ce modèle manuel n’est pas certifié exact ; une véritable photogrammétrie de musée a été trouvée mais nécessite une connexion Sketchfab pour télécharger le fichier.


### Accueil du 30 octobre 2026

Le panneau perforé et la courbe rejoignent la scène d’accueil derrière la boule, d’après l’ancienne publicité et les documents transmis par Florence. `speaker-backdrop.js` décrit la tôle avec 315 perforations traversantes et le support clair de la courbe. Ce sont de vrais objets de la scène, éclairés et déplacés avec le haut-parleur. Courbe illustrative, sans chiffres ni résultat de mesure annoncé. Pied de page et autres contenus conservés.

Poster `assets/accueil-acoustique-v5.webp` (900 × 834, transparent), exporté de la scène finale ; carte `assets/partage-lucane-v5.png` (1200 × 630). Pour renouveler le poster, exporter le canvas de la même scène avec `data-capture="true"` et un cadre de 900 × 834, puis optimiser en WebP. Ce mode fige la vue finale et conserve le tampon WebGL uniquement pour la capture. Les fichiers de contrôle restent dans `qa/`, exclus du dépôt et du build.

Contrôles locaux : rendus à 320 × 640, 390 × 844, 768 × 900, 1280 × 720, 1440 × 900 et 1920 × 1080 ; menu mobile ; clavier, retour initial et glissement souris ; image de repli avec WebGL rendu indisponible ; branche de mouvement réduit simulée. Sur petit téléphone, la scène et les liens peuvent dépasser en hauteur pour rester lisibles. Pas de validation sur téléphone physique. Aperçu GitHub Pages uniquement.


Précision du 30 octobre : le support de la courbe est avancé devant la tôle perforée et légèrement relevé pour rendre le tracé visible. La boule reste au premier plan. Poster et carte de partage v6 synchronisés, contrôle visuel bureau 1440 px et téléphone 390 px.

Les cinq liens autour de la scène ont un contour bleu et des coins arrondis pour rendre leur fonction de bouton explicite. Fond bleu au survol et au focus clavier. Sur mobile, boutons séparés dans une grille de deux colonnes et bouton « Votre projet » sur toute la largeur ; espace réservé adapté pour garder le texte lisible. Composition 3D et carte de partage conservées.
