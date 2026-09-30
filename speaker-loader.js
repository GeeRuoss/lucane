const host=document.querySelector('#speaker-scene');
if(host){
  const sceneUrl=new URL('./speaker-scene.js',import.meta.url);
  sceneUrl.search=new URL(import.meta.url).search;
  import(sceneUrl.href).catch(()=>{host.dataset.failed='true';host.querySelector('.speaker-poster').hidden=false;});
}
