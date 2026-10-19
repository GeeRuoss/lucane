export const photos = {
  vallee: {alt:'Sion et la vallée du Rhône entourées de montagnes',author:'Abhishek Navlakha',source:'https://www.pexels.com/photo/aerial-view-of-the-picturesque-town-in-switzerland-30785207/'},
  route: {alt:'Route alpine au pied de versants rocheux en Suisse',author:'Adrien Olichon',source:'https://www.pexels.com/photo/view-of-rocky-mountains-from-an-asphalt-road-18332439/'},
  oiseau: {alt:'Rouge-gorge perché dans la végétation',author:'Michael King',source:'https://www.pexels.com/photo/european-robin-bird-20548552/'}
};
export function editorial(url) {
  const photo=(key,cls='',sizes='(max-width: 767px) 100vw, 60vw')=>`<img class="editorial-photo ${cls}" src="${url('assets/photo-'+key+'-960.webp')}" srcset="${url('assets/photo-'+key+'-640.webp')} 640w, ${url('assets/photo-'+key+'-960.webp')} 960w, ${url('assets/photo-'+key+'-1600.webp')} ${key==='oiseau'?1200:1600}w" sizes="${sizes}" width="1600" height="${key==='vallee'?900:2400}" alt="${photos[key].alt}" loading="lazy" decoding="async">`;
  const service={
    waves:`<section class="room-notes section"><div><p class="eyebrow">Les sons du quotidien</p><h2>Une salle.<br>Plusieurs façons de l’habiter.</h2></div><div class="room-examples"><article><h3>Se comprendre</h3><p>En classe ou en réunion, une parole claire aide chacun à suivre les échanges.</p></article><article><h3>Partager un moment</h3><p>Dans un restaurant ou un espace d’accueil, le confort d’écoute accompagne la convivialité.</p></article><article><h3>Adapter le lieu</h3><p>Volume, surfaces et aménagement se pensent ensemble, en fonction des usages de la salle.</p></article></div></section>`,
    terrain:`<section class="context-section context-road section">${photo('route')}<div><p class="eyebrow">À l’échelle du paysage</p><h2>Le bruit ne s’arrête<br>pas à la façade.</h2><p>Circulation, activités et installations partagent le même environnement que les logements et les espaces de détente.</p><p>Pour comprendre une gêne, on commence par situer les sources, les lieux d’écoute et les moments où elle apparaît. Ce contexte guide ensuite l’étude et les mesures.</p></div></section>`
  };
  const credits=`<h2>Crédits photographiques</h2><p>Photographies d’ambiance sous <a href="https://www.pexels.com/license/">licence Pexels</a>, redimensionnées et recadrées pour le site. Elles ne représentent pas des réalisations de Lucane.</p>${Object.entries(photos).map(([key,p])=>`<p>${p.alt} : <a href="${p.source}">${p.author} / Pexels</a>.</p>`).join('')}`;
  return {service,credits};
}
