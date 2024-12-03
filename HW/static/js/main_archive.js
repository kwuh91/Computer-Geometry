import * as THREE from "three";
import * as  dat from 'dat.gui';
import WebGL from "three/addons/capabilities/WebGL.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

const sunTexturePath = '../../graphics/sun.jpg';
const starsTexturePath = '../../graphics/stars.jpg';

const sunRadius = 5;

const segments = 32;
// const widthSegments  = segments;
// const heightSegments = segments;

let renderer, camera, scene, controls;

let skybox, sun;

init();

function init() {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // set camera
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        10e7
    );
    camera.position.set( 10, 7, 10 );

    // set scene
    scene = new THREE.Scene();
    scene.add( camera );
    camera.lookAt( scene.position );

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // bg
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(starsTexturePath);

    let geometry = new THREE.SphereGeometry(500, 60, 40);
    let material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);

    //

    sun = createSphere(sunRadius, sunTexturePath);
    scene.add(sun);

    // // Create a BoxGeometry
    // geometry = new THREE.BoxGeometry(10, 100, 10); // Width, Height, Depth

    // // Create a MeshBasicMaterial with red color
    // material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // // Combine the geometry and material into a Mesh
    // const parallelepiped = new THREE.Mesh(geometry, material);

    // // Set the position of the mesh
    // parallelepiped.position.set(0, 0, 0);

    // // Add the mesh to the scene
    // scene.add(parallelepiped);

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

    // set renderer
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild(renderer.domElement);

    // set controls
    controls = new OrbitControls(camera, renderer.domElement);

    // 

    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function createSphere(radius, texturePath, widthSegments=segments, heightSegments=segments) {
    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(texturePath, () => {
        console.log('Texture loaded');
    });

    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphere = new THREE.Mesh(geometry, material);

    return sphere
}

// main animation loop
function animate() {
	// requestAnimationFrame(animate);

	// scene.add(line);
    sun.rotation.x += 0.005;
    sun.rotation.y += 0.005;

    // skybox.rotation.x -= 0.005;
    // skybox.rotation.y -= 0.005;

	// i += 1;
	renderer.render(scene, camera);
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// check for compatibility
if (WebGL.isWebGL2Available()) {
	// Initiate function or other initializations here
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById("container").appendChild(warning);
}
