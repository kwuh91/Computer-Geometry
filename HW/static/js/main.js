import * as THREE from 'three'
import * as  dat from 'dat.gui';

// Data and visualization
import { CompositionShader} from './shaders/CompositionShader.js'
import { BLOOM_LAYER, BLOOM_PARAMS } from "./config/renderConfig.js";

// Rendering
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Galaxy } from './objects/galaxy.js';
import { SolarSystem } from './objects/solarSystem.js';

import { GALAXY_SCALE_FACTOR } from './config/solarSystemConfig.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let canvas, renderer, camera, scene, orbit, bloomComposer, overlayComposer, finalComposer

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_LAYER );

const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

let isFreeCam = true;
let isTransitioning = false;
let transitionCurve = null;
let transitionTime = 0;
const transitionDuration = 5; // Duration of the transition in seconds

function initThree() {

    // grab canvas
    canvas = document.querySelector('#canvas');

    // scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xEBE2DB, 0.00003);

    // camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, GALAXY_SCALE_FACTOR*2 );
    // camera.position.set(0, 500, 500);
    camera.position.set(0, 150, 150);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    // map orbit
    orbit = new OrbitControls(camera, canvas)
    orbit.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    orbit.dampingFactor = 0.05;
    orbit.screenSpacePanning = false;
    orbit.minDistance = 1;
    orbit.maxDistance = GALAXY_SCALE_FACTOR*2;
    orbit.maxPolarAngle = (Math.PI / 2) - (Math.PI / 360)

    initRenderPipeline()

}

function initRenderPipeline() {

    // Assign Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        logarithmicDepthBuffer: true,
    })
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5

    // General-use rendering pass for chaining
    const renderScene = new RenderPass( scene, camera )

    // Rendering pass for bloom
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    bloomPass.threshold = BLOOM_PARAMS.bloomThreshold
    bloomPass.strength = BLOOM_PARAMS.bloomStrength
    bloomPass.radius = BLOOM_PARAMS.bloomRadius

    // bloom composer
    bloomComposer = new EffectComposer(renderer)
    bloomComposer.renderToScreen = false
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass)

    // overlay composer
    overlayComposer = new EffectComposer(renderer)
    overlayComposer.renderToScreen = false
    overlayComposer.addPass(renderScene)

    // Shader pass to combine base layer, bloom, and overlay layers
    const mixPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: CompositionShader.vertex,
            fragmentShader: CompositionShader.fragment,
            defines: {}
        } ), 'baseTexture'
    );
    mixPass.needsSwap = true;

    const outputPass = new OutputPass();

    finalComposer = new EffectComposer( renderer );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( mixPass );
    finalComposer.addPass( outputPass );
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

async function render() {

    if (isTransitioning) {
        transitionTime += 0.016; // Assuming 60 FPS
        if (transitionTime >= transitionDuration) {
            transitionTime = transitionDuration;
            isTransitioning = false;
        }
        const t = easeInOut(transitionTime / transitionDuration);
        const point = transitionCurve.getPoint(t);
        camera.position.copy(point);
        camera.lookAt(solarSystem.earth.obj.position);
        orbit.target.copy(solarSystem.earth.obj.position);
        orbit.update();
    } else if (isFreeCam) {
        orbit.update();
    } else {
        // Lock camera to follow solarSystem.earth.position
        const earthPosition = solarSystem.earth.obj.position.clone();
        const offset = new THREE.Vector3().subVectors(camera.position, orbit.target);
        camera.position.copy(earthPosition).add(offset);
        camera.lookAt(earthPosition);
        orbit.target.copy(earthPosition);
        orbit.update();
    }

    // fix buffer size
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // fix aspect ratio
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    if (typeof galaxy !== 'undefined') {
        galaxy.updateScale(camera)
    } 

    solarSystem.updateScale(camera);
    solarSystem.rotate();

    // console.log(`in render`)

    // Run each pass of the render pipeline
    renderPipeline()

    requestAnimationFrame(render)

}

function renderPipeline() {

    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );

    // render the entire scene, then render bloom scene on top
    finalComposer.render();
}

function darkenNonBloomed( obj ) {

    if ( bloomLayer.test( obj.layers ) === false ) {

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

    }

}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }

}

initThree()
let axes = new THREE.AxesHelper(50.0)
scene.add(axes)

// let galaxy = new Galaxy(scene)

let solarSystem = new SolarSystem(scene, false);

// Initialize dat.gui
const gui = new dat.GUI();
const controls = {
    freecam: function() {
        isFreeCam = true;
    },
    earth: function() {
        isFreeCam = false;
        const earthPosition = solarSystem.earth.obj.position.clone();
        const offset = new THREE.Vector3(0, 1, 1); // Adjust the offset as needed
        const targetPosition = earthPosition.clone().add(offset);

        // Define a Bezier curve
        const startPoint = camera.position.clone();
        const controlPoint1 = startPoint.clone().lerp(targetPosition, 0.33);
        controlPoint1.y += 5; // Adjust the control point for a smoother curve
        const controlPoint2 = startPoint.clone().lerp(targetPosition, 0.66);
        controlPoint2.y += 5; // Adjust the control point for a smoother curve

        transitionCurve = new THREE.CubicBezierCurve3(
            startPoint,
            controlPoint1,
            controlPoint2,
            targetPosition
        );

        isTransitioning = true;
        transitionTime = 0;
    }
};
gui.add(controls, 'freecam').name('Free Camera');
gui.add(controls, 'earth').name('Follow Earth');

requestAnimationFrame(render)

// // Create a loader
// const loader = new GLTFLoader();
// // Load the GLB file
// loader.load('../../graphics/shark.glb', function(gltf) {
//     const model = gltf.scene;

//     // Scale the model
//     model.scale.set(1000, 1000, 1000); // Scale the model to twice its original size

//     // Move the model
//     model.position.set(0 + SUN_X, 100 + SUN_Y, 0); // Move the model 1 unit along the x-axis

//     model.rotateX(Math.PI/2);

//     model.layers.enable(0);

//     // Add the model to the scene
//     scene.add(model);
// }, undefined, function(error) {
//     console.error(error);
// });