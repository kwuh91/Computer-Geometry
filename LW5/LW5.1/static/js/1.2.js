import * as THREE from 'three';
import * as dat from 'dat.gui';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.OrthographicCamera(
  -width / 800,
  width / 800,
  height / 800,
  -height / 800,
  -800,
  800
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();

const controls = {
  basicColor: 0xFFB703,
};
const guiColor = gui.addColor(controls, 'basicColor');

const controlsPetals = {
  visible: true,
  wireframe: false,
  radius: 1,
  petalCount: 10,
};

let petals = [];

function createPetals(controlsPetals) {
  function createPetal(numPoints) {
    function createLine(plane) {
      const mirrorx = plane.mirrorx;
      const mirrory = plane.mirrory;

      let startPoint, controlPoint1, controlPoint2, endPoint, x, y;
      if (!mirrorx && !mirrory) {
        // second plane
        x = 1;
        y = 1;

        startPoint = new THREE.Vector3(-controlsPetals.radius / 2 * x + 0.3, 0, 0);
        controlPoint1 = new THREE.Vector3(-controlsPetals.radius / 2 * x, 3 / 4 * controlsPetals.radius * y, 0);
        controlPoint2 = new THREE.Vector3(-0.1, 3 / 4 * controlsPetals.radius * y * 1.2, 0);
        endPoint = new THREE.Vector3(0, controlsPetals.radius * y, 0);
      }

      if (mirrorx && !mirrory) {
        // first plane
        x = -1;
        y = 1;

        startPoint = new THREE.Vector3(0, controlsPetals.radius * y, 0);
        controlPoint1 = new THREE.Vector3(0.1, 3 / 4 * controlsPetals.radius * y * 1.2, 0);
        controlPoint2 = new THREE.Vector3(-controlsPetals.radius / 2 * x, 3 / 4 * controlsPetals.radius * y, 0);
        endPoint = new THREE.Vector3(-controlsPetals.radius / 2 * x - 0.3, 0, 0);
      }

      if (mirrorx && mirrory) {
        // fourth plane
        x = -1;
        y = -1;

        startPoint = new THREE.Vector3(-controlsPetals.radius / 2 * x - 0.3, 0, 0);
        controlPoint1 = new THREE.Vector3(-controlsPetals.radius / 2 * x, 3 / 4 * controlsPetals.radius * y, 0);
        controlPoint2 = new THREE.Vector3(0.1, 3 / 4 * controlsPetals.radius * y * 1.2, 0);
        endPoint = new THREE.Vector3(0, controlsPetals.radius * y, 0);
      }

      if (!mirrorx && mirrory) {
        // third plane
        x = 1;
        y = -1;

        startPoint = new THREE.Vector3(0, controlsPetals.radius * y, 0);
        controlPoint1 = new THREE.Vector3(-0.1, 3 / 4 * controlsPetals.radius * y * 1.2, 0);
        controlPoint2 = new THREE.Vector3(-controlsPetals.radius / 2 * x, 3 / 4 * controlsPetals.radius * y, 0);
        endPoint = new THREE.Vector3(-controlsPetals.radius / 2 * x + 0.3, 0, 0);
      }

      const curve = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);

      const points = curve.getPoints(numPoints);

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      return geometry;
    }

    const firstPlane = { mirrorx: true, mirrory: false };
    const secondPlane = { mirrorx: false, mirrory: false };
    const thirdPlane = { mirrorx: false, mirrory: true };
    const fourthPlane = { mirrorx: true, mirrory: true };

    // first line
    const geometry1 = createLine(secondPlane);

    // Second line
    const geometry2 = createLine(firstPlane);

    // Third line
    const geometry3 = createLine(fourthPlane);

    // fourth line
    const geometry4 = createLine(thirdPlane);

    // Combine geometries
    const combinedGeometry = new THREE.BufferGeometry();

    const vertices1 = geometry1.attributes.position.array;
    const vertices2 = geometry2.attributes.position.array;
    const vertices3 = geometry3.attributes.position.array;
    const vertices4 = geometry4.attributes.position.array;

    const combinedVertices = new Float32Array(
      vertices1.length + vertices2.length + vertices3.length + vertices4.length
    );
    combinedVertices.set(vertices1, 0);
    combinedVertices.set(vertices2, vertices1.length);
    combinedVertices.set(vertices3, vertices1.length + vertices2.length);
    combinedVertices.set(vertices4, vertices1.length + vertices2.length + vertices3.length);

    combinedGeometry.setAttribute('position', new THREE.BufferAttribute(combinedVertices, 3));

    return combinedGeometry;
  }

  // Function to convert BufferGeometry to a list of Vector3
  function bufferGeometryToVector3List(geometry) {
    const positionAttribute = geometry.getAttribute('position');
    const vector3List = [];

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);
      vector3List.push(new THREE.Vector3(x, y, z));
    }

    return vector3List;
  }

  const numPoints = 100;

  const petalGeometry = createPetal(numPoints);
  const petalVector3List = bufferGeometryToVector3List(petalGeometry);

  const petalShape = new THREE.ShapeGeometry(new THREE.Shape(petalVector3List));
  const petalMaterial = new THREE.MeshBasicMaterial({
    color: controls.basicColor,
    wireframe: controlsPetals.wireframe,
    visible: controlsPetals.visible,
  });

  // Clear old petals
  petals.forEach((petal) => scene.remove(petal));
  petals = [];

  for (let i = 0; i < controlsPetals.petalCount; i++) {
    const angle = (i / controlsPetals.petalCount) * Math.PI * 2;
    const petal = new THREE.Mesh(petalShape, petalMaterial);
    petal.scale.set(0.5, 0.5, 1);
    petal.position.set(Math.cos(angle) * controlsPetals.radius / 4, Math.sin(angle) * controlsPetals.radius / 4, 0);
    petal.rotation.z = angle + Math.PI / 2;
    scene.add(petal);
    petals.push(petal);
  }
}

const guiPetalsParameters = gui.addFolder('petal parameters');

guiPetalsParameters.add(controlsPetals, 'radius', 0.5, 10).onChange(function (e) {
    createPetals(controlsPetals)
    centerMesh.position.z = 0.1;
    renderer.render(scene, camera);
});

guiPetalsParameters.add(controlsPetals, 'petalCount', 0, 20).onChange(function (e) {
    createPetals(controlsPetals)
    centerMesh.position.z = 0.1;
    renderer.render(scene, camera);
});

guiColor.onChange(function (e) {
  petals.forEach((petal) => (petal.material.color = new THREE.Color(e)));
});

guiPetalsParameters.add(controlsPetals, 'visible').onChange(function (e) {
  petals.forEach((petal) => (petal.material.visible = e));
});

guiPetalsParameters.add(controlsPetals, 'wireframe').onChange(function (e) {
  petals.forEach((petal) => (petal.material.wireframe = e));
});

// Initial creation of petals
createPetals(controlsPetals);

// seed

const controlsSeed = {
    seedColor: 0xff6700, 
    seedRadius: 0.3,     
    seedSegments: 32,    
    seedWireframe: false, 
    seedVisible: true,   
};

const guiSeedParameters = gui.addFolder('Seed Parameters');

guiSeedParameters.addColor(controlsSeed, 'seedColor').onChange(function (value) {
    centerMesh.material.color.set(value);
});

guiSeedParameters.add(controlsSeed, 'seedRadius', 0.1, 1).onChange(function (value) {
    centerMesh.geometry.dispose(); 
    centerMesh.geometry = new THREE.CircleGeometry(value, controlsSeed.seedSegments);
});

guiSeedParameters.add(controlsSeed, 'seedSegments', 3, 64, 1).onChange(function (value) {
    centerMesh.geometry.dispose(); 
    centerMesh.geometry = new THREE.CircleGeometry(controlsSeed.seedRadius, value);
});

guiSeedParameters.add(controlsSeed, 'seedWireframe').onChange(function (value) {
    centerMesh.material.wireframe = value;
});

guiSeedParameters.add(controlsSeed, 'seedVisible').onChange(function (value) {
    centerMesh.visible = value;
});

const centerGeometry = new THREE.CircleGeometry(controlsSeed.seedRadius, controlsSeed.seedSegments);
const centerMaterial = new THREE.MeshBasicMaterial({
    color: controlsSeed.seedColor,
    wireframe: controlsSeed.seedWireframe,
    visible: controlsSeed.seedVisible,
});
const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
scene.add(centerMesh);

// Render loop
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
