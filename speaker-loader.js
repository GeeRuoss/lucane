const host=document.querySelector('#speaker-scene');
if(host){
  let started=false;
  const load=()=>{if(started)return;started=true;import('./speaker-scene.js').catch(()=>{host.dataset.failed='true';});};
  if(matchMedia('(pointer:coarse), (max-width:767px)').matches){
    host.addEventListener('pointerdown',load,{once:true,passive:true});
    host.addEventListener('keydown',load,{once:true});
    const hint=document.querySelector('.orbital-bottom p');if(hint)hint.textContent='Touchez pour explorer';
  }else if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:1200});
  else setTimeout(load,250);
}
