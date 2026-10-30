export function legalPages({live, company: c, credits}) {
  const identity = `${c.legal}, ${c.street}, ${c.city}, Suisse`;
  const mail = `<a href="mailto:${c.email}">${c.email}</a>`;
  const privacyIntro = live
    ? `<p>Le site lucane.ch est édité par ${identity}, responsable du traitement des données lié à ce site. Pour toute question : ${mail}.</p>`
    : `<p>Cette proposition de refonte présente les informations publiques de ${c.legal}, ${c.street}, ${c.city}. Pour toute question : ${mail}.</p>`;
  const hosting = live
    ? `<p>Le site est hébergé par Ex2. Les journaux techniques de l’hébergeur enregistrent notamment l’adresse IP, les pages demandées et des informations sur le navigateur afin de fournir le site, détecter les abus et assurer sa sécurité. Les règles de conservation et les informations sur les traitements de l’hébergeur figurent dans sa <a href="https://www.ex2.com/ca/privacy-policy" target="_blank" rel="noopener">politique de confidentialité</a>. Ex2 indique exploiter ses principaux centres de données en France et au Canada.</p>`
    : `<p>Cette prévisualisation est hébergée par GitHub Pages. L’hébergeur peut traiter des informations techniques, notamment l’adresse IP, pour fournir et sécuriser le service. Voir la <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">déclaration de confidentialité de GitHub</a>.</p>`;
  const contactPrivacy = `<p>Le lien WhatsApp ouvre une conversation ; vous décidez ensuite de l’envoi de votre message. WhatsApp applique sa propre <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener">politique de confidentialité</a>. Les liens e-mail et téléphone ouvrent votre application habituelle. Le site ne reçoit ni ne stocke le contenu de ces échanges.</p>`;
  const privacyEnd = live
    ? `<h2>Vos demandes et vos droits</h2><p>Lorsque vous contactez Lucane, les coordonnées et informations que vous transmettez permettent au bureau de répondre à votre demande et de suivre votre projet. Pour connaître les données conservées dans le cadre de vos échanges, leur durée de conservation, ou demander leur accès, leur rectification ou leur suppression dans les limites légales applicables, contactez ${mail}.</p>`
    : `<h2>Avant la mise en service officielle</h2><p>Les informations relatives à l’hébergement définitif et à la gestion des demandes devront être confirmées avec Lucane avant le remplacement du site actuel.</p>`;
  const termsIntro = live
    ? `<h2>Éditeur du site</h2><p>Le site lucane.ch présente les activités de ${identity}.</p>`
    : `<h2>Une proposition de refonte</h2><p>Cette version présente une proposition graphique et éditoriale préparée pour Lucane. Le site officiel actuel reste accessible sur <a href="https://lucane.ch/">lucane.ch</a>. Les contenus de cette proposition sont à confirmer avec l’entreprise avant sa mise en service officielle.</p>`;
  return [
    {
      path: 'confidentialite/', title: 'Confidentialité',
      description: live ? 'Données, hébergement et moyens de contact utilisés par le site Lucane.' : 'Informations sur les données et les services utilisés par cette proposition de site Lucane.',
      content: `<section class="legal section"><p class="eyebrow">Informations</p><h1>Confidentialité</h1>${privacyIntro}<h2>Navigation et hébergement</h2>${hosting}<h2>Vos messages</h2>${contactPrivacy}<h2>Cookies et mesure d’audience</h2><p>Aucun outil publicitaire ou de mesure d’audience n’est activé. Les polices et la scène 3D sont hébergées avec le site. Le navigateur retient seulement, pour la session en cours, que l’invitation de contact a déjà été affichée.</p>${privacyEnd}</section>`,
    },
    {
      path: 'conditions/', title: 'Conditions d’utilisation',
      description: live ? 'Éditeur, informations, prestations et visuels du site Lucane.' : 'Conditions d’utilisation de la proposition de site vitrine Lucane.',
      content: `<section class="legal section"><p class="eyebrow">Informations</p><h1>Conditions d’utilisation</h1>${termsIntro}<h2>Informations et prestations</h2><p>Les textes donnent une présentation générale des activités. Ils ne constituent ni un devis, ni une étude acoustique, ni une conclusion sur la conformité d’un bâtiment. Le périmètre d’une intervention se définit directement avec le bureau.</p><h2>Contact</h2><p>${identity}. ${mail} · <a href="tel:${c.tel}">${c.phone}</a>.</p><h2>Visuels</h2><p>Les maquettes et compositions 3D illustrent l’acoustique. Elles ne représentent pas des mesures, des projets réalisés ou des résultats techniques.</p>${credits}</section>`,
    },
  ];
}
