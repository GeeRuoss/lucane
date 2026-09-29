import * as THREE from 'three';

export const sceneBackground = 0xe9e9e7;

/** Four related, intentionally abstract studies of sound and its environment. */
export function createAcousticModel(kind = 'abstract') {
  const model = new THREE.Group();
  const blue = new THREE.MeshStandardMaterial({ color: 0x1836cb, roughness: .42, metalness: .06 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x142969, roughness: .56, metalness: .025 });
  const pale = new THREE.MeshStandardMaterial({ color: 0xdfe3ea, roughness: .86 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0xaebadb, roughness: .8 });
  const add = (geometry, material, x = 0, y = 0, z = 0, parent = model) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const box = (w, h, d, material, x = 0, y = 0, z = 0, parent = model) =>
    add(new THREE.BoxGeometry(w, h, d), material, x, y, z, parent);
  const slab = (width, height, depth, material, x = 0, y = 0, z = 0, parent = model) => {
    const r = .025;
    const outline = new THREE.Shape();
    outline.moveTo(-width / 2 + r, 0);
    outline.lineTo(width / 2 - r, 0);
    outline.quadraticCurveTo(width / 2, 0, width / 2, r);
    outline.lineTo(width / 2, height - r);
    outline.quadraticCurveTo(width / 2, height, width / 2 - r, height);
    outline.lineTo(-width / 2 + r, height);
    outline.quadraticCurveTo(-width / 2, height, -width / 2, height - r);
    outline.lineTo(-width / 2, r);
    outline.quadraticCurveTo(-width / 2, 0, -width / 2 + r, 0);
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth, steps: 1, bevelEnabled: true, bevelSize: .012,
      bevelThickness: .012, bevelSegments: 2, curveSegments: 3,
    });
    geometry.translate(0, 0, -depth / 2);
    return add(geometry, material, x, y, z, parent);
  };
  const tree = (x, groundY, z, scale = 1) => {
    const group = new THREE.Group();
    group.position.set(x, groundY, z);
    group.scale.setScalar(scale);
    model.add(group);
    add(new THREE.CylinderGeometry(.043, .058, .80, 12), dark, 0, .40, 0, group);
    const crown = add(new THREE.SphereGeometry(.38, 24, 18), leaf, 0, 1.02, 0, group);
    crown.scale.set(.88, 1.32, .88);
    return group;
  };

  if (kind === 'building') {
    // Repeated gabled sections describe the building without miniature details.
    box(5.7, .12, 4.1, pale, 0, -.06, 0);
    const house = new THREE.Group();
    house.position.set(-.46, 0, -.10);
    model.add(house);
    const outline = new THREE.Shape();
    outline.moveTo(-1.78, .035);
    outline.lineTo(1.78, .035);
    outline.lineTo(1.78, 1.91);
    outline.lineTo(0, 3.02);
    outline.lineTo(-1.78, 1.91);
    outline.closePath();
    const hollow = new THREE.Path();
    hollow.moveTo(-1.56, .22);
    hollow.lineTo(-1.56, 1.78);
    hollow.lineTo(0, 2.76);
    hollow.lineTo(1.56, 1.78);
    hollow.lineTo(1.56, .22);
    hollow.closePath();
    outline.holes.push(hollow);
    const ribGeometry = new THREE.ExtrudeGeometry(outline, {
      depth: .105, bevelEnabled: true, bevelSize: .012,
      bevelThickness: .012, bevelSegments: 2, steps: 1,
    });
    ribGeometry.translate(0, 0, -.0525);
    for (let i = 0; i < 15; i++) add(ribGeometry, blue, 0, 0, -1.35 + i * .193, house);
    // A quiet inner volume and recessed front give the sectional shell weight.
    box(2.93, 1.48, 2.27, pale, 0, .94, -.045, house);
    box(2.71, 1.28, .045, dark, 0, .94, 1.115, house);
    box(.075, 1.34, .065, blue, .40, .94, 1.155, house);
    box(3.12, .075, .48, pale, 0, .038, 1.62, house);
    tree(2.15, 0, -.80, 1.02);
  } else if (kind === 'waves') {
    // An open room: two absorbing walls, floating ceiling clouds and central air.
    box(5.55, .12, 3.90, pale, 0, -.06, 0);
    box(5.12, .035, 3.48, pale, 0, .018, 0);
    for (let i = 0; i < 21; i++) {
      const x = -2.37 + i * .237;
      const h = 2.12 + .14 * Math.cos(i / 20 * Math.PI * 2);
      slab(.125, h, .22, blue, x, .035, -1.61);
    }
    for (let i = 0; i < 13; i++) {
      const z = -1.35 + i * .237;
      const h = 2.08 + .14 * Math.sin(i / 12 * Math.PI);
      box(.23, h, .125, blue, -2.40, h / 2 + .035, z);
    }
    // Separated ceiling baffles leave the interior legible at the shared angle.
    for (let i = 0; i < 6; i++) {
      const panel = box(.52, .105, 2.12, blue, -1.88 + i * .77, 2.70 + Math.sin(i * .75) * .065, -.30);
      panel.rotation.z = -.025;
    }
  } else if (kind === 'terrain') {
    // The topographic relief is a stack of thin sections, continuous across them.
    const elevation = (x, z) => .22
      + 1.50 * Math.exp(-((x + .88) ** 2 / 2.0 + (z + .47) ** 2 / 1.35))
      + .92 * Math.exp(-((x - 1.61) ** 2 / .95 + (z - .67) ** 2 / .95));
    box(5.7, .10, 4.1, pale, 0, -.05, 0);
    for (let i = 0; i < 27; i++) {
      const x = -2.6 + i * .20;
      const profile = new THREE.Shape();
      profile.moveTo(-1.83, .015);
      profile.lineTo(1.83, .015);
      for (let j = 0; j <= 36; j++) {
        const u = 1.83 - j * 3.66 / 36;
        profile.lineTo(u, elevation(x, -u));
      }
      profile.closePath();
      const geometry = new THREE.ExtrudeGeometry(profile, {
        depth: .135, steps: 1, bevelEnabled: true,
        bevelSize: .008, bevelThickness: .008, bevelSegments: 1,
      });
      geometry.translate(0, 0, -.0675);
      geometry.rotateY(Math.PI / 2);
      add(geometry, dark, x, 0, 0);
    }
    tree(-1.05, elevation(-1.05, -.53), -.53, .81);
    tree(1.47, elevation(1.47, .42), .42, .80);
    tree(.32, elevation(.32, -1.04), -1.04, .60);
  } else {
    // The original acoustic gesture: twenty-three cobalt fins, two rolling crests.
    for (let i = 0; i < 23; i++) {
      const t = i / 22;
      const h = 1.08 + 2.05 * Math.sin(t * Math.PI * 1.5 + .17) ** 2;
      slab(.125, h, 1.72, blue, (i - 11) * .238, .02, Math.sin(t * Math.PI * 2) * .14);
    }
  }
  return model;
}

// Kept for callers of the previous single-model implementation.
export function createArchitecturalModel() {
  return createAcousticModel('building');
}

export function setupView(aspect = 1) {
  const camera = new THREE.OrthographicCamera();
  camera.near = .1;
  camera.far = 50;
  camera.position.set(7.6, 5.2, 9.4);
  camera.lookAt(0, 1.05, 0);
  const height = Math.max(5.7, 7.25 / aspect);
  camera.left = -height * aspect / 2;
  camera.right = height * aspect / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return camera;
}
