const host=document.querySelector('#speaker-scene');
if(host){
  const sceneUrl=new URL('./speaker-scene.js',import.meta.url);
  sceneUrl.search=new URL(import.meta.url).search;
  const load=()=>import(sceneUrl.href).catch(()=>{host.dataset.failed='true';});
  if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:1200});
  else setTimeout(load,250);
}
