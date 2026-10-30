import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createAcousticBackdrop} from './speaker-backdrop.js';

const host = document.querySelector('#speaker-scene');
if (host) mount();

function mount() {
  const fallback = () => {
    host.dataset.failed = 'true';
    delete host.dataset.ready;
    host.querySelector('.speaker-poster').hidden = false;
  };
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: host.dataset.capture === 'true'});
  } catch { fallback(); return; }
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .01, 20);
  const target = new THREE.Vector3(0, .63, 0);
  const spherical = new THREE.Spherical().setFromVector3(new THREE.Vector3(.2, 1.12, 3.1).sub(target));
  const initialTheta = spherical.theta, initialPhi = spherical.phi, initialRadius = spherical.radius;
  const environment = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environment, .04);
  scene.environment = env.texture;
  scene.environmentIntensity = .48;
  environment.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf3f5ff, 0x565b72, 2));
  for (const [color, power, pos] of [[0xffffff, 3.3, [-2, 3, 3]], [0x8197ff, 1.9, [2, 1.5, 1]], [0x172fc5, 1.5, [-1, 1, -2]]]) {
    const light = new THREE.DirectionalLight(color, power);
    light.position.set(...pos); scene.add(light);
  }

  // Les trois objets partagent la même perspective et le même éclairage.
  const backdrop = createAcousticBackdrop();
  scene.add(backdrop.group);
  const speaker = new THREE.Group();
  speaker.position.set(.025, 0, .30);
  scene.add(speaker);
  const metal = new THREE.MeshStandardMaterial({color: 0x182139, metalness: .72, roughness: .3});
  const rubber = new THREE.MeshStandardMaterial({color: 0x070b13, roughness: .85});
  function rod(a, b, radius, material = metal) {
    a = new THREE.Vector3(...a); b = new THREE.Vector3(...b);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 16), material);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    speaker.add(mesh);
  }
  rod([0, .20, 0], [0, .575, 0], .010);
  rod([0, .245, 0], [0, .295, 0], .026);
  for (let i = 0; i < 3; i++) {
    const angle = i * Math.PI * 2 / 3, x = Math.cos(angle), z = Math.sin(angle);
    rod([0, .27, 0], [x * .27, .018, z * .27], .009);
    rod([0, .17, 0], [x * .145, .14, z * .145], .004);
    rod([x * .264, .019, z * .264], [x * .286, .015, z * .286], .013, rubber);
  }

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 3, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(12,24,70,.22)');
  gradient.addColorStop(1, 'rgba(12,24,70,0)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  for (const [x, z, width, depth, opacity] of [[.025, .30, 1, .8, 1], [-.35, -.3, 1.25, .65, .5], [.4, -.2, 1.1, .65, .3]]) {
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({map: shadowTexture, transparent: true, opacity, depthWrite: false}));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(x, .001, z); scene.add(shadow);
  }

  let visible = true, ready = false, pending = false, lost = false;
  let theta = initialTheta, phi = initialPhi, lastFrame = 0, introTime = 0, introDone = false;
  let driftX = 0, driftY = 0, wantedX = 0, wantedY = 0, pointer = null;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const ease = value => 1 - Math.pow(1 - THREE.MathUtils.clamp(value, 0, 1), 3);

  function settleIntro() {
    introDone = true; introTime = 3200;
    backdrop.arrive(1, 1);
    speaker.position.y = 0;
    host.dataset.intro = 'complete';
  }
  function draw(now) {
    pending = false;
    if (lost || !visible || document.hidden || !ready) { lastFrame = 0; return; }
    if (lastFrame && now - lastFrame < 32) { request(); return; }
    const dt = lastFrame ? Math.min(now - lastFrame, 64) : 32;
    lastFrame = now;
    if (reduced.matches) { settleIntro(); driftX = driftY = wantedX = wantedY = 0; }
    if (!introDone) {
      introTime += dt;
      const panelProgress = ease(introTime / 1900);
      const graphProgress = ease((introTime - 180) / 2300);
      backdrop.arrive(panelProgress, graphProgress);
      speaker.position.y = (1 - ease(introTime / 1700)) * .065;
      if (introTime >= 3200) settleIntro();
    }
    driftX += (wantedX - driftX) * .14;
    driftY += (wantedY - driftY) * .14;
    spherical.theta = theta + driftX + (introDone ? 0 : (1 - ease(introTime / 3000)) * .15);
    spherical.phi = phi + driftY;
    camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical));
    camera.lookAt(target);
    renderer.render(scene, camera);
    host.dataset.ready = 'true';
    host.dataset.angle = theta.toFixed(3);
    if (!introDone || Math.abs(wantedX - driftX) + Math.abs(wantedY - driftY) > .0002) request();
    else lastFrame = 0;
  }
  function request() {
    if (!pending && !lost) { pending = true; requestAnimationFrame(draw); }
  }
  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Contenir toute la composition sur un téléphone étroit, sans recadrage CSS.
    spherical.radius = initialRadius * Math.max(1, 1.14 / camera.aspect);
    request();
  }
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; lastFrame = 0; if (visible) request(); }).observe(host);
  document.addEventListener('visibilitychange', () => { lastFrame = 0; if (!document.hidden) request(); });
  reduced.addEventListener('change', () => { lastFrame = 0; request(); });

  // Une courte arrivée, puis une réponse au geste. Les panneaux restent derrière la boule.
  const clampTheta = value => THREE.MathUtils.clamp(value, initialTheta - .38, initialTheta + .38);
  const clampPhi = value => THREE.MathUtils.clamp(value, initialPhi - .13, initialPhi + .12);
  host.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    settleIntro(); wantedX = wantedY = 0;
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, theta, phi, touch: event.pointerType === 'touch', active: false};
    request();
  });
  host.addEventListener('pointermove', event => {
    if (!pointer) {
      if (event.pointerType !== 'mouse' || reduced.matches) return;
      const rect = host.getBoundingClientRect();
      wantedX = ((event.clientX - rect.left) / rect.width - .5) * .09;
      wantedY = ((event.clientY - rect.top) / rect.height - .5) * .035;
      request(); return;
    }
    if (pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (!pointer.active) {
      if (Math.hypot(dx, dy) < 6) return;
      if (pointer.touch && Math.abs(dy) > Math.abs(dx)) { pointer = null; return; }
      pointer.active = true;
      host.setPointerCapture(event.pointerId);
      host.classList.add('is-dragging');
    }
    theta = clampTheta(pointer.theta - dx * .003);
    phi = clampPhi(pointer.phi - dy * .002);
    request();
  });
  function release() { pointer = null; host.classList.remove('is-dragging'); }
  host.addEventListener('pointerup', release);
  host.addEventListener('pointercancel', release);
  host.addEventListener('lostpointercapture', release);
  host.addEventListener('pointerleave', () => { wantedX = wantedY = 0; request(); });
  host.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault(); settleIntro(); wantedX = wantedY = driftX = driftY = 0;
    if (event.key === 'Home') { theta = initialTheta; phi = initialPhi; }
    if (event.key === 'ArrowLeft') theta = clampTheta(theta - .12);
    if (event.key === 'ArrowRight') theta = clampTheta(theta + .12);
    if (event.key === 'ArrowUp') phi = clampPhi(phi - .06);
    if (event.key === 'ArrowDown') phi = clampPhi(phi + .06);
    request();
  });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true; canvas.hidden = true; fallback();
  });
  new GLTFLoader().load(new URL('./speaker.glb', import.meta.url).href, gltf => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(.55 / size.y);
    box.setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x, .55 - box.min.y, -center.z);
    speaker.add(model); ready = true;
    if (host.dataset.capture === 'true') settleIntro();
    resize();
  }, undefined, () => { canvas.remove(); fallback(); });
  resize();
}
