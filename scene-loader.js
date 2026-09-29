const scene=document.querySelector('#acoustic-scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let started=false;
const start=async()=>{if(started||reduced.matches||!scene)return;started=true;try{await import('./scene.js');}catch{started=false;}};
if(!reduced.matches){
  if(matchMedia('(min-width:768px)').matches){if('requestIdleCallback'in window)requestIdleCallback(start,{timeout:1500});else setTimeout(start,250);}
  else{scene?.addEventListener('pointerdown',start,{once:true,passive:true});}
}
