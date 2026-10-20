import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const host=document.querySelector('#lucane-model');
if(host){
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{host.dataset.failed='true';}
 if(renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.01,100),target=new THREE.Vector3();
 const env=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(env,.04).texture;scene.environmentIntensity=1;env.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0xa0a8c0,3));
 for(const [pos,power] of [[[2,5,3],3],[[-3,2,-3],3]]){const light=new THREE.DirectionalLight(0xffffff,power);light.position.set(...pos);scene.add(light);}
 let radius=6,theta=2.6,phi=.75,ready=false;
 function draw(){if(!ready)return;camera.position.copy(target).add(new THREE.Vector3().setFromSphericalCoords(radius*Math.max(1,1.1/camera.aspect),phi,theta));camera.lookAt(target);renderer.render(scene,camera);}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw();}new ResizeObserver(resize).observe(host);
 new GLTFLoader().load(new URL('./lucane-prototype.glb',import.meta.url).href,g=>{const box=new THREE.Box3().setFromObject(g.scene),size=box.getSize(new THREE.Vector3());box.getCenter(target);scene.add(g.scene);radius=Math.max(size.x,size.y,size.z)*1.8;ready=true;host.dataset.ready='true';resize();},undefined,()=>{host.dataset.failed='true';});
 let pointer;
 host.addEventListener('pointerdown',e=>{if(e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,theta,phi,active:false,touch:e.pointerType==='touch'};});
 host.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(!pointer.active){if(Math.hypot(dx,dy)<6)return;if(pointer.touch&&Math.abs(dy)>Math.abs(dx)){pointer=null;return;}pointer.active=true;host.setPointerCapture(e.pointerId);}theta=pointer.theta-dx*.008;phi=THREE.MathUtils.clamp(pointer.phi-dy*.005,.2,1.5);draw();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(event,()=>pointer=null);
 host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){theta=2.6;phi=.75;}if(e.key==='ArrowLeft')theta-=.15;if(e.key==='ArrowRight')theta+=.15;if(e.key==='ArrowUp')phi=Math.max(.2,phi-.1);if(e.key==='ArrowDown')phi=Math.min(1.5,phi+.1);draw();});
 }
}
