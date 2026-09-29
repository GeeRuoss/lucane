import * as THREE from 'three';

export const sceneBackground = 0xe9e9e7;
export function createArchitecturalModel() {
  const model = new THREE.Group();
  const blue = new THREE.MeshStandardMaterial({color:0x1836cb,roughness:.48,metalness:.08});
  const dark = new THREE.MeshStandardMaterial({color:0x152767,roughness:.52});
  const pale = new THREE.MeshStandardMaterial({color:0xdfe3ea,roughness:.86});
  const glass = new THREE.MeshStandardMaterial({color:0x9fbae1,roughness:.22,metalness:.36});
  const leaf = new THREE.MeshStandardMaterial({color:0xaebadb,roughness:.8});
  const add=(geometry,material,x=0,y=0,z=0,parent=model)=>{
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);
    mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  };
  // A small architectural model: a gabled house, acoustic ribs and a tree.
  add(new THREE.BoxGeometry(5.7,.13,4.1),pale,0,-.065,0);
  const house=new THREE.Group();house.position.x=-.55;model.add(house);
  const width=2.8, eaves=1.9, peak=2.85, depth=2.6;
  const profile=new THREE.Shape();
  profile.moveTo(-width/2,.08);profile.lineTo(width/2,.08);
  profile.lineTo(width/2,eaves);profile.lineTo(0,peak);
  profile.lineTo(-width/2,eaves);profile.closePath();
  const geometry=new THREE.ExtrudeGeometry(profile,{depth:depth,bevelEnabled:false,steps:1});
  geometry.translate(0,0,-depth/2);
  add(geometry,blue,0,0,0,house);
  // Wide glazed front, with a recessed-looking surround and a clear entrance.
  add(new THREE.BoxGeometry(2.43,1.55,.05),dark,0,.885,depth/2+.025,house);
  add(new THREE.BoxGeometry(1.49,1.34,.018),glass,-.39,.88,depth/2+.061,house);
  add(new THREE.BoxGeometry(.69,1.34,.018),glass,.80,.88,depth/2+.061,house);
  add(new THREE.BoxGeometry(.046,1.55,.11),blue,.405,.885,depth/2+.075,house);
  add(new THREE.BoxGeometry(.032,1.36,.065),blue,-.52,.88,depth/2+.09,house);
  add(new THREE.BoxGeometry(.024,.20,.07),pale,.56,.90,depth/2+.11,house);
  // A single triangular clerestory makes the pitched roof legible at small sizes.
  const clerestory=new THREE.Shape();clerestory.moveTo(-.73,2.02);clerestory.lineTo(.73,2.02);clerestory.lineTo(0,2.53);clerestory.closePath();
  add(new THREE.ShapeGeometry(clerestory),glass,0,0,depth/2+.013,house);
  // Side window and fine blue vertical fins connect architecture to acoustics.
  add(new THREE.BoxGeometry(.02,1.15,1.87),dark,width/2+.015,.92,0,house);
  add(new THREE.BoxGeometry(.022,1.03,1.71),glass,width/2+.029,.92,0,house);
  for(let i=0;i<13;i++)add(new THREE.BoxGeometry(.12,1.60,.035),blue,width/2+.07,.94,-1.14+i*.19,house);
  // Separate roof ribs retain the rhythm of the first acoustic sculpture.
  const slope=Math.atan2(peak-eaves,width/2);
  const roofLength=Math.hypot(width/2+.12,peak-eaves+.08);
  for(let i=0;i<17;i++){
    const z=-depth/2-.10+i*(depth+.20)/16;
    const right=add(new THREE.BoxGeometry(roofLength,.105,.075),blue,width/4, (peak+eaves)/2+.075,z,house);right.rotation.z=-slope;
    const left=add(new THREE.BoxGeometry(roofLength,.105,.075),blue,-width/4,(peak+eaves)/2+.075,z,house);left.rotation.z=slope;
  }
  add(new THREE.BoxGeometry(2.70,.085,.45),pale,0,.035,depth/2+.25,house);
  // Three quiet terraces follow the architectural scale, not a measurement graph.
  for(let i=0;i<3;i++)add(new THREE.BoxGeometry(.72,.045,.21),pale,-.32,.025,1.72+i*.33);
  const tree=new THREE.Group();tree.position.set(1.95,0,-.55);model.add(tree);
  add(new THREE.CylinderGeometry(.055,.082,1.35,14),dark,0,.66,0,tree);
  const branch=add(new THREE.CylinderGeometry(.025,.04,.54,10),dark,.13,1.13,0,tree);branch.rotation.z=-.5;
  const crown=add(new THREE.SphereGeometry(.63,28,20),leaf,0,1.82,0,tree);crown.scale.set(.85,1.18,.84);
  const small=add(new THREE.SphereGeometry(.37,24,16),leaf,.31,1.40,.06,tree);small.scale.set(.85,1.1,.85);
  return model;
}
export function setupView(aspect=1) {
  const camera=new THREE.OrthographicCamera();
  camera.near=.1;camera.far=50;camera.position.set(7.6,5.2,9.4);camera.lookAt(0,1.05,0);
  const height=Math.max(5.7,7.25/aspect);
  camera.left=-height*aspect/2;camera.right=height*aspect/2;camera.top=height/2;camera.bottom=-height/2;
  camera.updateProjectionMatrix();camera.updateMatrixWorld();return camera;
}
