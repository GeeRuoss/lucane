import * as THREE from 'three';

// The sculpture is decorative; the page's content is always ordinary HTML.
const host = document.getElementById('acoustic-scene');
if (host) initAcousticSculpture(host);

function initAcousticSculpture(host) {
  host.setAttribute('aria-hidden', 'true');
  const poster = document.createElement('img');
  poster.src = new URL('./acoustic-sculpture.svg', import.meta.url).href;
  poster.addEventListener('load', () => { const fallback=host.querySelector('.scene-fallback'); if(fallback) fallback.hidden=true; });
  poster.alt = '';
  poster.width = 680;
  poster.height = 590;
  poster.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;';
  host.append(poster);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    const toggle = document.getElementById('motion-toggle');
    if (toggle) toggle.hidden = true;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0xe9e9e7, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.domElement.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;';
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 3.5, -3.5, 0.1, 60);
  camera.position.set(7.5, 5.1, 9);
  camera.lookAt(0, 1.25, 0);

  const sculpture = new THREE.Group();
  sculpture.rotation.y = -.16;
  scene.add(sculpture);

  const material = new THREE.MeshStandardMaterial({
    color: 0x172fc5,
    roughness: .32,
    metalness: .06,
  });

  for (let i = 0; i < 23; i += 1) {
    const t = i / 22;
    // Two crests, with a continuous curved edge across the complete object.
    const height = 1.18 + 2.15 * Math.pow(Math.sin(t * Math.PI * 1.5 + .17), 2);
    const width = .125;
    const radius = .026;
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2 + radius, 0);
    shape.lineTo(width / 2 - radius, 0);
    shape.quadraticCurveTo(width / 2, 0, width / 2, radius);
    shape.lineTo(width / 2, height - radius);
    shape.quadraticCurveTo(width / 2, height, width / 2 - radius, height);
    shape.lineTo(-width / 2 + radius, height);
    shape.quadraticCurveTo(-width / 2, height, -width / 2, height - radius);
    shape.lineTo(-width / 2, radius);
    shape.quadraticCurveTo(-width / 2, 0, -width / 2 + radius, 0);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      steps: 1, depth: 1.65, bevelEnabled: true,
      bevelSegments: 2, bevelSize: .015, bevelThickness: .015, curveSegments: 3,
    });
    geometry.translate(0, 0, -.825);
    const fin = new THREE.Mesh(geometry, material);
    fin.position.set((i - 11) * .238, .075, Math.sin(t * Math.PI * 2) * .14);
    fin.castShadow = true;
    fin.receiveShadow = true;
    sculpture.add(fin);
  }

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: .17 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = .015;
  ground.receiveShadow = true;
  scene.add(ground);

  const hemisphere = new THREE.HemisphereLight(0xffffff, 0xa0acd2, 2.9);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight(0xffffff, 4.1);
  key.position.set(-3, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.camera.near = .5;
  key.shadow.camera.far = 22;
  key.shadow.normalBias = .025;
  key.shadow.bias = -.0001;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc5d5ff, 1.1);
  fill.position.set(4, 2, -4);
  scene.add(fill);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let inView = true;
  let frame = 0;
  let tick = 0;
  let lastTime = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  const toggle = document.getElementById('motion-toggle');
  const canAnimate = () => !reducedMotion.matches && !userPaused && inView && !document.hidden;

  function updateToggle() {
    if (!toggle) return;
    const paused = reducedMotion.matches || userPaused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Animer la sculpture' : 'Mettre la sculpture en pause');
    toggle.dataset.paused = String(paused);
    toggle.disabled = reducedMotion.matches;
    const label = toggle.querySelector('[data-motion-label]');
    if (label) label.textContent = paused ? 'Animation en pause' : 'Mettre en pause';
  }

  function render() {
    renderer.render(scene, camera);
    poster.style.visibility = 'hidden';
  }

  function animate(now) {
    frame = 0;
    if (!canAnimate()) return;
    const delta = lastTime ? Math.min((now - lastTime) / 1000, .04) : .016;
    lastTime = now;
    tick += delta;
    const ease = 1 - Math.exp(-delta * 3);
    currentX += (pointerX - currentX) * ease;
    currentY += (pointerY - currentY) * ease;
    sculpture.rotation.y = -.16 + Math.sin(tick * .22) * .095 + currentX * .14;
    sculpture.rotation.z = currentY * .018;
    render();
    frame = requestAnimationFrame(animate);
  }

  function syncAnimation() {
    updateToggle();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (canAnimate()) frame = requestAnimationFrame(animate);
    else render();
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const viewHeight = Math.max(5.25, 6.65 / aspect);
    camera.left = -viewHeight * aspect / 2;
    camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    render();
  }

  host.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    const bounds = host.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
  }, { passive: true });
  host.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  toggle?.addEventListener('click', () => { userPaused = !userPaused; syncAnimation(); });
  reducedMotion.addEventListener('change', syncAnimation);
  document.addEventListener('visibilitychange', syncAnimation);
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncAnimation();
  }, { rootMargin: '80px' }).observe(host);
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    userPaused = true;
    poster.style.visibility = 'visible';
    renderer.domElement.style.visibility = 'hidden';
    if (toggle) toggle.hidden = true;
  });
  resize();
  syncAnimation();
}
