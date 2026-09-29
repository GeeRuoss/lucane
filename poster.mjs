import * as THREE from 'three';
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
import {createArchitecturalModel,setupView} from './scene-model.mjs';
// Deterministic projection of the same meshes as WebGL, with a depth buffer.
const width=1200,height=1067,model=createArchitecturalModel(),camera=setupView(width/height);
model.rotation.y=-.12;model.updateMatrixWorld(true);
const pixels=new Uint8Array(width*height*4),depth=new Float32Array(width*height);depth.fill(Infinity);
const light=new THREE.Vector3(-3,8,6).normalize(),normal=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),ab=new THREE.Vector3(),ac=new THREE.Vector3(),view=new THREE.Vector3();
const edge=(a,b,x,y)=>(x-a.x)*(b.y-a.y)-(y-a.y)*(b.x-a.x);
model.traverse(mesh=>{if(!mesh.isMesh)return;const geom=mesh.geometry,pos=geom.attributes.position,normals=geom.attributes.normal,idx=geom.index,n=idx?idx.count:pos.count,nm=new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
for(let i=0;i<n;i+=3){const ids=[0,1,2].map(k=>idx?idx.getX(i+k):i+k);a.fromBufferAttribute(pos,ids[0]).applyMatrix4(mesh.matrixWorld);b.fromBufferAttribute(pos,ids[1]).applyMatrix4(mesh.matrixWorld);c.fromBufferAttribute(pos,ids[2]).applyMatrix4(mesh.matrixWorld);ab.subVectors(b,a);ac.subVectors(c,a);normal.crossVectors(ab,ac).normalize();view.subVectors(camera.position,a);if(normal.dot(view)<=0)continue;
const projected=[a,b,c].map(p=>{p=p.clone().project(camera);return{x:(p.x+1)*width/2,y:(1-p.y)*height/2,z:p.z};});
const colors=ids.map(id=>{const vn=new THREE.Vector3().fromBufferAttribute(normals,id).applyMatrix3(nm).normalize();return mesh.material.color.clone().multiplyScalar(.68+.38*Math.max(0,vn.dot(light)));});
const [pa,pb,pc]=projected,area=edge(pa,pb,pc.x,pc.y);if(Math.abs(area)<.0001)continue;
const minX=Math.max(0,Math.floor(Math.min(pa.x,pb.x,pc.x))),maxX=Math.min(width-1,Math.ceil(Math.max(pa.x,pb.x,pc.x))),minY=Math.max(0,Math.floor(Math.min(pa.y,pb.y,pc.y))),maxY=Math.min(height-1,Math.ceil(Math.max(pa.y,pb.y,pc.y)));
for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
const wa=edge(pb,pc,x+.5,y+.5)/area,wb=edge(pc,pa,x+.5,y+.5)/area,wc=1-wa-wb;if(wa<0||wb<0||wc<0)continue;const z=wa*pa.z+wb*pb.z+wc*pc.z,p=y*width+x;if(z>=depth[p])continue;depth[p]=z;
const col=new THREE.Color(colors[0].r*wa+colors[1].r*wb+colors[2].r*wc,colors[0].g*wa+colors[1].g*wb+colors[2].g*wc,colors[0].b*wa+colors[1].b*wb+colors[2].b*wc).convertLinearToSRGB();pixels[p*4]=Math.min(255,col.r*255);pixels[p*4+1]=Math.min(255,col.g*255);pixels[p*4+2]=Math.min(255,col.b*255);pixels[p*4+3]=255;
}}});
const shadow=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="s"><stop stop-color="#172651" stop-opacity=".22"/><stop offset="1" stop-color="#172651" stop-opacity="0"/></radialGradient></defs><ellipse cx="650" cy="785" rx="430" ry="125" fill="url(#s)"/></svg>`);
const foreground=await sharp(pixels,{raw:{width,height,channels:4}}).png().toBuffer();
await mkdir('assets',{recursive:true});const merged=await sharp(shadow).composite([{input:foreground}]).png().toBuffer();await sharp(merged).resize(1000).webp({quality:92}).toFile('assets/architecture-poster.webp');
console.log('Rendered architectural poster');
