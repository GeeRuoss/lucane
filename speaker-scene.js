import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const host=document.querySelector('#speaker-scene');
if(host)mount();
function mount(){
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');host.append(canvas);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.01,20);
  const target=new THREE.Vector3(0,.58,0), spherical=new THREE.Spherical();
  const initial=new THREE.Vector3(1.5,1.05,2.4).sub(target);spherical.setFromVector3(initial);
  const initialTheta=spherical.theta,initialPhi=spherical.phi;
  const environment=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer);
  const env=pmrem.fromScene(environment,.04);scene.environment=env.texture;scene.environmentIntensity=.42;environment.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xe3e7f5,0x454966,1.8));
  for(const [color,power,pos]of [[0xe8f1ff,3.5,[-1.5,2,2]],[0x172fc5,3,[2,1,-.2]],[0x172fc5,2,[-1,1,-2]]]){const l=new THREE.DirectionalLight(color,power);l.position.set(...pos);scene.add(l);}
  const tripod=new THREE.Group();scene.add(tripod);
  const metal=new THREE.MeshStandardMaterial({color:0x182139,metalness:.72,roughness:.3});
  const rubber=new THREE.MeshStandardMaterial({color:0x070b13,roughness:.85});
  function rod(a,b,r,mat=metal){a=new THREE.Vector3(...a);b=new THREE.Vector3(...b);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,a.distanceTo(b),16),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.sub(a).normalize());tripod.add(m);return m;}
  rod([0,.20,0],[0,.575,0],.010);rod([0,.245,0],[0,.295,0],.026);
  for(let i=0;i<3;i++){const t=i*Math.PI*2/3,x=Math.cos(t),z=Math.sin(t);rod([0,.27,0],[x*.27,.018,z*.27],.009);rod([0,.17,0],[x*.145,.14,z*.145],.004);rod([x*.264,.019,z*.264],[x*.286,.015,z*.286],.013,rubber);}
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const ctx=shadowCanvas.getContext('2d');const g=ctx.createRadialGradient(64,64,3,64,64,64);g.addColorStop(0,'rgba(12,24,70,.22)');g.addColorStop(1,'rgba(0,2,12,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(.95,.95),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.001;scene.add(shadow);
  let visible=true,ready=false,pending=false,lost=false,theta=initialTheta,phi=initialPhi,autoRotate=true,lastFrame=0;
  const nav=document.querySelector('.orbital-nav'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  function draw(now){
    pending=false;
    if(lost||!visible||document.hidden||!ready){lastFrame=0;return;}
    const rotating=autoRotate&&!reduced.matches;
    if(rotating&&lastFrame&&now-lastFrame<32){request();return;}
    if(rotating&&lastFrame)theta+=Math.min((now-lastFrame)/1000,.05)*.16;
    lastFrame=now;
    spherical.theta=theta;spherical.phi=phi;
    camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));camera.lookAt(target);
    renderer.render(scene,camera);host.dataset.ready='true';host.dataset.angle=theta.toFixed(3);
    if(nav&&!reduced.matches){nav.style.setProperty('--orbit-x',`${Math.sin(theta-initialTheta)*12}px`);nav.style.setProperty('--orbit-y',`${(phi-initialPhi)*12}px`);}
    if(rotating)request();
  }
  reduced.addEventListener('change',()=>{lastFrame=0;request();});
  function request(){if(!pending){pending=true;requestAnimationFrame(draw);}}
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();spherical.radius=initial.length()*Math.max(1,.82/camera.aspect);request();}
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([e])=>{visible=e.isIntersecting;lastFrame=0;if(visible)request();}).observe(host);
  document.addEventListener('visibilitychange',()=>{lastFrame=0;if(!document.hidden)request();});
  let pointer=null;
  host.addEventListener('pointerdown',e=>{if(e.button!==0)return;autoRotate=false;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,theta,phi,touch:e.pointerType==='touch',active:false};});
  host.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(!pointer.active){if(Math.hypot(dx,dy)<6)return;if(pointer.touch&&Math.abs(dy)>Math.abs(dx)){pointer=null;return;}pointer.active=true;host.setPointerCapture(e.pointerId);host.classList.add('is-dragging');}theta=pointer.theta-dx*.007;phi=THREE.MathUtils.clamp(pointer.phi-dy*.005,.55,1.65);request();});
  function release(){pointer=null;host.classList.remove('is-dragging');}
  host.addEventListener('pointerup',release);host.addEventListener('pointercancel',release);host.addEventListener('lostpointercapture',release);
  host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();autoRotate=false;if(e.key==='Home'){theta=initialTheta;phi=initialPhi;}if(e.key==='ArrowLeft')theta-=.12;if(e.key==='ArrowRight')theta+=.12;if(e.key==='ArrowUp')phi=Math.max(.55,phi-.09);if(e.key==='ArrowDown')phi=Math.min(1.65,phi+.09);request();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;delete host.dataset.ready;canvas.hidden=true;});
  new GLTFLoader().load(new URL('./speaker.glb',import.meta.url).href,gltf=>{const model=gltf.scene;const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());model.scale.setScalar(.5/size.y);box.setFromObject(model);const center=box.getCenter(new THREE.Vector3());model.position.set(-center.x,.55-box.min.y,-center.z);scene.add(model);ready=true;const hint=document.querySelector('.orbital-bottom p');if(hint)hint.textContent='Glissez pour explorer';resize();},undefined,()=>{canvas.remove();host.dataset.failed='true';});
  resize();
}
