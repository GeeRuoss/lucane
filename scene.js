import * as THREE from 'three';
import {createAcousticModel,setupView} from './scene-model.mjs';
const host=document.getElementById('acoustic-scene');
if(host) mount(host);
function mount(host){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches)return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.setClearColor(0xe9e9e7,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
  renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
  const scene=new THREE.Scene(),model=createAcousticModel(host.dataset.scene || 'abstract');scene.add(model);
  let camera=setupView();
  const ambient=new THREE.HemisphereLight(0xffffff,0x9aaacb,2.3);scene.add(ambient);
  const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(-3,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:25});key.shadow.normalBias=.025;key.shadow.bias=-.0001;key.shadow.radius=4;scene.add(key);
  const fill=new THREE.DirectionalLight(0xc7d5ff,.9);fill.position.set(4,3,-5);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.15}));ground.rotation.x=-Math.PI/2;ground.position.y=-.14;ground.receiveShadow=true;scene.add(ground);
  const poster=host.querySelector('.scene-fallback');
  let raf=0,visible=true,start=0,previous=0,elapsed=0,targetX=0,targetY=0,currentX=0,currentY=0;
  const introDuration=4.2;
  function draw(){renderer.render(scene,camera);if(poster)poster.hidden=true;}
  function frame(now){
    raf=0;if(!visible||document.hidden||reduced.matches)return;
    if(!start)start=now;
    const dt=previous?Math.min((now-previous)/1000,.05):.016;previous=now;elapsed+=dt;
    const ease=1-Math.exp(-dt*5);currentX+=(targetX-currentX)*ease;currentY+=(targetY-currentY)*ease;
    const progress=Math.min(elapsed/introDuration,1),intro=.16*Math.pow(1-progress,2);
    model.rotation.y=-.12+intro+currentX*.15;
    model.rotation.x=currentY*.045;
    draw();
    // Intro finishes within five seconds; later motion follows the pointer only.
    if(elapsed<introDuration||Math.abs(targetX-currentX)>.001||Math.abs(targetY-currentY)>.001)raf=requestAnimationFrame(frame);
  }
  function wake(){if(!raf&&visible&&!document.hidden&&!reduced.matches){previous=0;raf=requestAnimationFrame(frame);}}
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera=setupView(w/h);draw();wake();}
  host.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=host.getBoundingClientRect();targetX=(e.clientX-rect.left)/rect.width*2-1;targetY=(e.clientY-rect.top)/rect.height*2-1;wake();},{passive:true});
  host.addEventListener('pointerleave',()=>{targetX=0;targetY=0;wake();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
  reduced.addEventListener('change',()=>{cancelAnimationFrame(raf);raf=0;if(reduced.matches){model.rotation.set(0,-.12,0);draw();}else wake();});
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'20px'}).observe(host);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;renderer.domElement.hidden=true;if(poster)poster.hidden=false;});
  resize();wake();
}
