import * as THREE from 'three';
import * as  dat from 'dat.gui';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 10);

const width = window.innerWidth
const height = window.innerHeight


const camera = new THREE.OrthographicCamera( -width / 800, 
                                              width / 800, 
                                              height / 800,
                                             -height / 800, -800, 800 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();

// Create and position each petal around the center
// const petalCount = 20; // Number of petals
// const radius = 0.6;    // Distance from the center

const controls = {
    basicColor: "#ffffff"
};
const guiColor = gui.addColor(controls, 'basicColor');

const controlsPetals = {
    visible: true,
    wireframe: false,
    radius: 1,
    petalCount: 10
}

function createPetals(petalCount, radius, controlsPetals) {
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
    
    // const radius = 1;
    const numPoints = 100;
    
    const petalGeometry = createPetal(radius, numPoints)
    const petalVector3List = bufferGeometryToVector3List(petalGeometry);
    
    // // Create a material for the curve
    // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    
    // // Create a line to represent the curve
    // const petal = new THREE.Line(petalGeometry, material);
    
    const petalShape    = new THREE.ShapeGeometry(new THREE.Shape(petalVector3List));
    const petalMaterial = new THREE.MeshBasicMaterial({color: controls.basicColor, 
                                                       wireframe: controls.wireframe,
                                                       visible: controlsPetals.visible});

    const guiPetalsParameters = gui.addFolder('petal parameters');
    // const petalMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // yellow

    let petal;

    guiColor.onChange(function (e) {
        petal.material.color = new THREE.Color(e);
    });

    guiPetalsParameters.add(controlsPetals, 'visible').onChange(function(e) {
        petal.material.visible = e;
    });

    guiPetalsParameters.add(controlsPetals, 'wireframe').onChange(function(e) {
        petal.material.wireframe = e;
    });

    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        petal = new THREE.Mesh(petalShape, petalMaterial);
        petal.scale.set(0.5, 0.5, 1)
        petal.position.set(Math.cos(angle) * radius / 4, Math.sin(angle) * radius / 4, 0);
        petal.rotation.z = angle + Math.PI / 2; // Rotate to align with center
        scene.add(petal);
    
        // console.log(`i: ${i}`)
        // console.log(`angle: ${angle}`)
        // console.log(`x: ${Math.cos(angle) * radius}`)
        // console.log(`y: ${Math.sin(angle) * radius}`)
        // console.log(`phi: ${angle + Math.PI / 2}`)
        // console.log()
    }
}

let petalCount = 10; // Number of petals
let radius = 1;    // Distance from the center

createPetals(petalCount, radius, controlsPetals)


// Sunflower center (seed part)
const centerGeometry = new THREE.CircleGeometry(0.3, 32); // radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float
const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xff6700 }); // brown
const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
scene.add(centerMesh);

// Render loop
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

// // // // // // // // // // // // // // // // // // // // // // // //

animate();

// // // // // // // // // // // // // // // // // // // // // // // //

// create a scene, that will hold all our elements such as objects, cameras and lights.
// const scene = new THREE.Scene();

// // create a render, sets the background color and the size
// const renderer = new THREE.WebGLRenderer();
// renderer.setClearColor(0x000000, 1.0);
// renderer.setSize(window.innerWidth, window.innerHeight);

// // show axes in the screen
// // const axes = new THREE.AxesHelper(50);
// // scene.add(axes);

// // create a camera, which defines where we're looking at.
// let camera = new THREE.OrthographicCamera( -window.innerWidth / 20, 
//                                             window.innerWidth / 20, 
//                                             window.innerHeight / 20,
//                                             -window.innerHeight / 20, -20, 20 );

// const gui = new dat.GUI();

// const lineGeometry = new THREE.BufferGeometry();
// const points = [];
// const colors = [];
// const radius = 20, twopi = 2 * Math.PI, N_SEGMENTS = 100;
// for (let i = 0; i <= N_SEGMENTS; i++) {
//     const x = radius * Math.cos( i / N_SEGMENTS * twopi );
//     const y = radius * Math.sin( i / N_SEGMENTS * twopi );
//     points.push(x, y, 0);
    
//     colors.push(i / (N_SEGMENTS - 1), 0, (N_SEGMENTS - 1 - i) / (N_SEGMENTS - 1));
// }

// const vertices = new Float32Array( points );
// lineGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

// const verticesColors = new Float32Array( colors );
// lineGeometry.setAttribute('color', new THREE.BufferAttribute(verticesColors, 3));

// const controls = {
//     basicColor: "#ffffff"
// };
// const guiColor = gui.addColor(controls, 'basicColor');

// // circle

// const controlsCircle = {
//     visible: false,
//     wireframe: false,
//     radius: 20,
//     segments: 50,
//     thetaStart: Math.PI / 4,
//     thetaLength: 3 * Math.PI / 2

// };

// // create a geometry
// const geometryCircle = new THREE.CircleGeometry(controlsCircle.radius, controlsCircle.segments, controlsCircle.thetaStart, controlsCircle.thetaLength);

// const materialCircle = new THREE.MeshBasicMaterial( {color: controls.basicColor, wireframe: controlsCircle.wireframe, visible: controlsCircle.visible});

// guiColor.onChange(function (e) {
//     meshCircle.material.color = new THREE.Color(e);
// });

// const guiCircleParameters = gui.addFolder('circle parameters');

// guiCircleParameters.add(controlsCircle, 'visible').onChange(function (e) {
//     meshCircle.material.visible = e;
// });
// guiCircleParameters.add(controlsCircle, 'wireframe').onChange(function (e) {
//     meshCircle.material.wireframe = e;
// });
// guiCircleParameters.add(controlsCircle, 'radius', 1, 40).onChange(function (e) {
//     meshCircle.geometry = new THREE.CircleGeometry(controlsCircle.radius, controlsCircle.segments, controlsCircle.thetaStart, controlsCircle.thetaLength);
// });
// guiCircleParameters.add(controlsCircle, 'segments', 1, 100, 1).onChange(function (e) {
//     meshCircle.geometry = new THREE.CircleGeometry(controlsCircle.radius, controlsCircle.segments, controlsCircle.thetaStart, controlsCircle.thetaLength);
// });
// guiCircleParameters.add(controlsCircle, 'thetaStart', 0, Math.PI * 2).onChange(function (e) {
//     meshCircle.geometry = new THREE.CircleGeometry(controlsCircle.radius, controlsCircle.segments, controlsCircle.thetaStart, controlsCircle.thetaLength);
// });
// guiCircleParameters.add(controlsCircle, 'thetaLength', 0, Math.PI * 2).onChange(function (e) {
//     meshCircle.geometry = new THREE.CircleGeometry(controlsCircle.radius, controlsCircle.segments, controlsCircle.thetaStart, controlsCircle.thetaLength);
// });

// const meshCircle = new THREE.Mesh(geometryCircle, materialCircle);

// scene.add(meshCircle);

// // add the output of the renderer to the html element
// document.body.appendChild(renderer.domElement);

// function render() {
//     // position the camera
//     camera.position.x = 0;
//     camera.position.y = 0;
//     camera.position.z = 15;

//     camera.lookAt(scene.position);

//     // render using requestAnimationFrame
//     requestAnimationFrame(render);
//     renderer.render(scene, camera);
// }

// // call the render function
// render();

// // // // // // // // // // // // // // // // // // // // // // // //

// function drawShape() {

//   // create a basic shape
//   var shape = new THREE.Shape();

//   // startpoint
//   shape.moveTo(10, 10);

//   // straight line upwards
//   shape.lineTo(10, 40);

//   // the top of the figure, curve to the right
//   shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

//   // spline back down
//   shape.splineThru(
//     [new THREE.Vector2(32, 30),
//       new THREE.Vector2(28, 20),
//       new THREE.Vector2(30, 10),
//     ]);

//   // curve at the bottom
//   shape.quadraticCurveTo(20, 15, 10, 10);

//   // add 'eye' hole one
//   var hole1 = new THREE.Path();
//   hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
//   shape.holes.push(hole1);

//   // add 'eye hole 2'
//   var hole2 = new THREE.Path();
//   hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
//   shape.holes.push(hole2);

//   // add 'mouth'
//   var hole3 = new THREE.Path();
//   hole3.absarc(20, 16, 2, 0, Math.PI, true);
//   shape.holes.push(hole3);

//   // return the shape
//   return shape;
// }