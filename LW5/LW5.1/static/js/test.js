import * as THREE from 'three';

// // Petals around the sunflower
// const controlPoints = [
//     [
//         new THREE.Vector2(-radius/2, 0),
//         new THREE.Vector2(-radius/2, 3/4 * radius),
//         new THREE.Vector2(0, 3/4 * radius),
//         new THREE.Vector2(0, radius)
//     ],
//     [
//         new THREE.Vector2(radius/2, 0),
//         new THREE.Vector2(radius/2, 3/4 * radius),
//         new THREE.Vector2(0, 3/4 * radius),
//         new THREE.Vector2(0, radius)
//     ]
// ];

// // //

// for (let i = 0; i < controlPoints.length; i++) {
//     const curve = new THREE.CubicBezierCurve(
//         controlPoints[i][0],
//         controlPoints[i][1],
//         controlPoints[i][2],
//         controlPoints[i][3]
//     );

//     for (let j = 0; j <= numPoints; j++) {
//         const point = curve.getPoint(j / numPoints);
//         vertices.push(point.x, point.y, 0);
//     }
// }

// petalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
// // petalGeometry.scale(1, 1, 1);
// const petalMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // yellow

// for (let i = 0; i < petalCount; i++) {
//     const angle = (i / petalCount) * Math.PI * 2;
//     const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
//     petalMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
//     petalMesh.rotation.z = angle + Math.PI / 2; // Rotate to align with center
//     scene.add(petalMesh);
// }

// // //

function createPetal(radius, numPoints) {
    function createLine(radius, plane){
        const mirrorx = plane.mirrorx
        const mirrory = plane.mirrory
    
        let startPoint, controlPoint1, controlPoint2, endPoint, x, y;
        if (!mirrorx && !mirrory) { // second plane
            x = 1
            y = 1
    
            // Define the control points for the cubic Bezier curve
            startPoint    = new THREE.Vector3(-radius / 2 * x + 0.3, 0,                        0);
            controlPoint1 = new THREE.Vector3(-radius / 2 * x,       3 / 4 * radius * y,       0);
            controlPoint2 = new THREE.Vector3(-0.1,                  3 / 4 * radius * y * 1.2, 0);
            endPoint      = new THREE.Vector3(0,                     radius * y,               0);
        } 
    
        if (mirrorx && !mirrory) { // first plane
            x = -1
            y = 1
    
            // Define the control points for the cubic Bezier curve
            startPoint    = new THREE.Vector3(0 ,                    radius * y,               0);
            controlPoint1 = new THREE.Vector3(0.1,                   3 / 4 * radius * y * 1.2, 0);
            controlPoint2 = new THREE.Vector3(-radius / 2 * x,       3 / 4 * radius * y,       0);
            endPoint      = new THREE.Vector3(-radius / 2 * x - 0.3, 0,                        0);
        } 
    
        if (mirrorx && mirrory) { // fourth plane
            x = -1
            y = -1
    
            // Define the control points for the cubic Bezier curve
            startPoint    = new THREE.Vector3(-radius / 2 * x - 0.3, 0,                        0);
            controlPoint1 = new THREE.Vector3(-radius / 2 * x,       3 / 4 * radius * y,       0);
            controlPoint2 = new THREE.Vector3(0.1,                   3 / 4 * radius * y * 1.2, 0);
            endPoint      = new THREE.Vector3(0,                     radius * y,               0);
        } 
    
        if (!mirrorx && mirrory) { // third plane
            x = 1
            y = -1
    
            // Define the control points for the cubic Bezier curve
            startPoint    = new THREE.Vector3(0,                     radius * y,               0);
            controlPoint1 = new THREE.Vector3(-0.1,                  3 / 4 * radius * y * 1.2, 0);
            controlPoint2 = new THREE.Vector3(-radius / 2 * x,       3 / 4 * radius * y,       0);
            endPoint      = new THREE.Vector3(-radius / 2 * x + 0.3, 0,                        0);
        } 
    
        // Create the cubic Bezier curve
        const curve = new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
    
        // Generate points along the curve
        const points = curve.getPoints(numPoints);
    
        // Create a geometry to hold the curve points
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
        return geometry
    }
    
    const firstPlane = {
        mirrorx: true,
        mirrory: false
    }
    
    const secondPlane = {
        mirrorx: false,
        mirrory: false
    }
    
    const thirdPlane = {
        mirrorx: false,
        mirrory: true
    }
    
    const fourthPlane = {
        mirrorx: true,
        mirrory: true
    }
    
    // first line
    const geometry1 = createLine(radius, secondPlane);
    
    // Second line
    const geometry2 = createLine(radius, firstPlane);
    
    // Third line
    const geometry3 = createLine(radius, fourthPlane);
    
    // fourth line
    const geometry4 = createLine(radius, thirdPlane);
    
    // Combine geometries
    const combinedGeometry = new THREE.BufferGeometry();
    
    // Extract vertices from both geometries
    const vertices1 = geometry1.attributes.position.array;
    const vertices2 = geometry2.attributes.position.array;
    const vertices3 = geometry3.attributes.position.array;
    const vertices4 = geometry4.attributes.position.array;
    
    // Combine vertices
    const combinedVertices = new Float32Array(vertices1.length + vertices2.length + vertices3.length + vertices4.length);
    combinedVertices.set(vertices1, 0);
    combinedVertices.set(vertices2, vertices1.length);
    combinedVertices.set(vertices3, vertices1.length + vertices2.length);
    combinedVertices.set(vertices4, vertices1.length + vertices2.length + vertices3.length);
    
    // console.log(combinedVertices)

    // Set the combined vertices to the combined geometry
    combinedGeometry.setAttribute('position', new THREE.BufferAttribute(combinedVertices, 3));

    return combinedGeometry
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

const radius = 1;
const numPoints = 100;

const petalGeometry = createPetal(radius, numPoints)
const petalVector3List = bufferGeometryToVector3List(petalGeometry);

// // Create a material for the curve
// const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

// // Create a line to represent the curve
// const petal = new THREE.Line(petalGeometry, material);

const petalShape = new THREE.ShapeGeometry(new THREE.Shape(petalVector3List));
const petalMaterial = new THREE.MeshBasicMaterial({color:"blue"});
const petal = new THREE.Mesh(petalShape, petalMaterial);

petal.position.set(radius, radius, 0);
petal.rotation.z = Math.PI / 2; // Rotate to align with center

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

// Set up the scene
const scene = new THREE.Scene();
scene.add(petal);

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();