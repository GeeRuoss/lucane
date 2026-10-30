import * as THREE from 'three';

function roundedShape(width, height, radius) {
  const shape = new THREE.Shape(), x = -width / 2, y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

export function createAcousticBackdrop() {
  const group = new THREE.Group();
  group.name = 'Composition acoustique';

  // Vraies perforations traversantes dans une tôle, avec une tranche visible.
  const shape = roundedShape(.91, 1.13, .055);
  for (let row = -10; row <= 10; row++) {
    for (let column = -7; column <= 7; column++) {
      const hole = new THREE.Path();
      hole.absarc(column * .052 + (Math.abs(row) % 2 ? .013 : -.013), row * .048, .0155, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
  }
  const panelGeometry = new THREE.ExtrudeGeometry(shape, {depth: .022, bevelEnabled: true, bevelSize: .0015, bevelThickness: .0015, bevelSegments: 1, steps: 1, curveSegments: 8});
  const panel = new THREE.Mesh(panelGeometry, new THREE.MeshStandardMaterial({color: 0x303949, metalness: .78, roughness: .32}));
  panel.name = 'Panneau perforé';
  panel.rotation.set(-.055, -.28, .11);
  group.add(panel);

  const graph = new THREE.Group();
  graph.name = 'Courbe acoustique illustrative';
  graph.rotation.set(-.035, -.16, -.095);
  const sheet = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedShape(1.08, .81, .045), {depth: .013, bevelEnabled: true, bevelSize: .003, bevelThickness: .003, bevelSegments: 2, steps: 1}), new THREE.MeshStandardMaterial({color: 0xf7f8ff, metalness: .12, roughness: .38}));
  graph.add(sheet);
  const gridPoints = [];
  for (let x = -.43; x <= .44; x += .145) gridPoints.push(x, -.29, .019, x, .29, .019);
  for (let y = -.29; y <= .30; y += .116) gridPoints.push(-.43, y, .019, .44, y, .019);
  const grid = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3)), new THREE.LineBasicMaterial({color: 0x172fc5, transparent: true, opacity: .16}));
  graph.add(grid);

  // Silhouette inspirée du document de Florence, sans chiffres ni mesure annoncée.
  const response = [[0,.58],[.045,.78],[.09,.69],[.145,.9],[.20,.86],[.27,.64],[.33,.55],[.40,.52],[.48,.32],[.54,.29],[.63,.36],[.70,.31],[.78,.4],[.85,.28],[.92,.15],[1,0]];
  const points = response.map(([x, y]) => new THREE.Vector3(-.43 + x * .87, -.245 + y * .52, .033));
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', .2);
  const curveGeometry = new THREE.TubeGeometry(curve, 160, .0065, 7, false);
  const trace = new THREE.Mesh(curveGeometry, new THREE.MeshStandardMaterial({color: 0x172fc5, roughness: .3, metalness: .15}));
  graph.add(trace);
  const referencePoints = [[-.43,.06],[-.32,.19],[-.18,.17],[.02,.09],[.18,-.09],[.37,-.25]].map(([x,y]) => new THREE.Vector3(x,y,.025));
  const reference = new THREE.Line(new THREE.BufferGeometry().setFromPoints(referencePoints), new THREE.LineDashedMaterial({color: 0x7f8aa9, dashSize: .018, gapSize: .016, transparent: true, opacity: .65}));
  reference.computeLineDistances(); graph.add(reference);
  group.add(graph);
  const totalIndices = curveGeometry.index.count;

  function arrive(panelProgress, graphProgress) {
    panel.position.set(-.37, .73 - (1 - panelProgress) * .12, -.31);
    panel.rotation.z = .11 + (1 - panelProgress) * .07;
    // Avancer le graphique devant la tôle et dégager la courbe au-dessus de la boule.
    graph.position.set(.33 + (1 - graphProgress) * .13, .97, .06 - (1 - graphProgress) * .04);
    graph.rotation.z = -.095 - (1 - graphProgress) * .06;
    curveGeometry.setDrawRange(0, Math.floor(totalIndices * graphProgress / 3) * 3);
  }
  arrive(1, 1);
  return {group, arrive};
}
