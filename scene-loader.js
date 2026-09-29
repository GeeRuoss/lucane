const motion=document.querySelector('#motion-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let started=false;
async function start(){if(started||reduced.matches)return;started=true;motion.disabled=true;motion.setAttribute('aria-label','Chargement de l’animation');try{await import('./scene.js');motion.disabled=false;}catch{started=false;motion.disabled=false;motion.setAttribute('aria-label','Réessayer l’animation 3D');}}
if(reduced.matches){motion.hidden=true;}else if(matchMedia('(min-width:768px)').matches){if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:1500});else setTimeout(start,250);}else{motion.dataset.paused='true';motion.setAttribute('aria-label','Activer l’animation 3D');motion.addEventListener('click',()=>{if(!started)start();});}
