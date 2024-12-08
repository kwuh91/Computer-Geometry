import * as THREE from 'three'

// Data and visualization
import { CompositionShader} from './shaders/CompositionShader.js'
import { BASE_LAYER, BLOOM_LAYER, BLOOM_PARAMS, OVERLAY_LAYER } from "./config/renderConfig.js";

// Rendering
// import { MapControls } from 'three/addons/controls/MapControls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Galaxy } from './objects/galaxy.js';
import { Star } from './objects/star.js';
// import { triplanarTexture } from 'three/webgpu';

// let canvas, renderer, camera, scene, orbit, baseComposer, bloomComposer, overlayComposer

// const BASE_LAYER = 0;

// function initThree() {

//     // grab canvas
//     canvas = document.querySelector('#canvas');

//     // scene
//     scene = new THREE.Scene();
//     scene.fog = new THREE.FogExp2(0xEBE2DB, 0.00003);

//     // camera
//     camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 5000000 );
//     camera.position.set(0, 500, 500);
//     camera.up.set(0, 0, 1);
//     camera.lookAt(0, 0, 0);

//     // map orbit
//     // orbit = new MapControls(camera, canvas)
//     orbit = new OrbitControls(camera, canvas)
//     orbit.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
//     orbit.dampingFactor = 0.05;
//     orbit.screenSpacePanning = false;
//     orbit.minDistance = 1;
//     orbit.maxDistance = 16384;
//     orbit.maxPolarAngle = (Math.PI / 2) - (Math.PI / 360)

//     initRenderPipeline()

// }

// function initRenderPipeline() {

//     // Assign Renderer
//     renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         canvas,
//         logarithmicDepthBuffer: true,
//     })
//     renderer.setPixelRatio( window.devicePixelRatio )
//     renderer.setSize( window.innerWidth, window.innerHeight )
//     renderer.outputEncoding = THREE.sRGBEncoding
//     renderer.toneMapping = THREE.ACESFilmicToneMapping
//     renderer.toneMappingExposure = 0.5

//     // General-use rendering pass for chaining
//     const renderScene = new RenderPass( scene, camera )

//     // Rendering pass for bloom
//     // const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
//     // bloomPass.threshold = BLOOM_PARAMS.bloomThreshold
//     // bloomPass.strength = BLOOM_PARAMS.bloomStrength
//     // bloomPass.radius = BLOOM_PARAMS.bloomRadius

//     // // bloom composer
//     // bloomComposer = new EffectComposer(renderer)
//     // bloomComposer.renderToScreen = false
//     // bloomComposer.addPass(renderScene)
//     // bloomComposer.addPass(bloomPass)

//     // // overlay composer
//     // overlayComposer = new EffectComposer(renderer)
//     // overlayComposer.renderToScreen = false
//     // overlayComposer.addPass(renderScene)

//     // // Shader pass to combine base layer, bloom, and overlay layers
//     // const finalPass = new ShaderPass(
//     //     new THREE.ShaderMaterial( {
//     //         uniforms: {
//     //             baseTexture: { value: null },
//     //             bloomTexture: { value: bloomComposer.renderTarget2.texture },
//     //             overlayTexture: { value: overlayComposer.renderTarget2.texture }
//     //         },
//     //         vertexShader: CompositionShader.vertex,
//     //         fragmentShader: CompositionShader.fragment,
//     //         defines: {}
//     //     } ), 'baseTexture'
//     // );
//     // finalPass.needsSwap = true;

//     // base layer composer
//     baseComposer = new EffectComposer( renderer )
//     baseComposer.addPass( renderScene )
//     // baseComposer.addPass(finalPass)
// }

// function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//       renderer.setSize(width, height, false);
//     }
//     return needResize;
// }

// async function render() {

//     orbit.update()

//     // fix buffer size
//     if (resizeRendererToDisplaySize(renderer)) {
//         const canvas = renderer.domElement;
//         camera.aspect = canvas.clientWidth / canvas.clientHeight;
//         camera.updateProjectionMatrix();
//     }

//     // fix aspect ratio
//     const canvas = renderer.domElement;
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();

//     galaxy.updateScale(camera)

//     // Run each pass of the render pipeline
//     renderPipeline()

//     requestAnimationFrame(render)

// }

// function renderPipeline() {

//     // // Render bloom
//     // camera.layers.set(BLOOM_LAYER)
//     // bloomComposer.render()

//     // // Render overlays
//     // camera.layers.set(OVERLAY_LAYER)
//     // overlayComposer.render()

//     // Render normal
//     // camera.layers.set(BASE_LAYER)
//     baseComposer.render()
// }

// initThree()
// let axes = new THREE.AxesHelper(5.0)
// scene.add(axes)

// let galaxy = new Galaxy(scene)


// // camera.layers.set(OVERLAY_LAYER)

// //

// // const textureLoader = new THREE.TextureLoader();
// // const texture = textureLoader.load('../../graphics/stars.jpg');

// // let geometry = new THREE.SphereGeometry(900, 60, 60);
// // let material = new THREE.MeshBasicMaterial({
// //     map: texture,
// //     side: THREE.BackSide
// // });
// // let skybox = new THREE.Mesh(geometry, material);
// // scene.add(skybox);

// // Create a BoxGeometry
// let geometry = new THREE.BoxGeometry(0.5, 0.5, 500); // Width, Height, Depth

// // Create a MeshBasicMaterial with red color
// let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// // Combine the geometry and material into a Mesh
// const parallelepiped = new THREE.Mesh(geometry, material);

// // Set the position of the mesh
// parallelepiped.position.set(145, -175, 0); // solar system coordinates

// // Add the mesh to the scene
// scene.add(parallelepiped);

// // 

// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load('../../graphics/sun.jpg', () => {
//     console.log('Texture loaded');
// });
// geometry = new THREE.SphereGeometry(1, 16, 16);
// material = new THREE.MeshBasicMaterial({ map: texture });
// // material = new THREE.SpriteMaterial({map: texture});
// const sphere = new THREE.Mesh(geometry, material);
// // sphere.layers.set(OVERLAY_LAYER)
// // sphere.layers.set(BLOOM_LAYER)
// // sphere.layers.set(BASE_LAYER)
// // const sphere = new THREE.Sprite(material);
// sphere.position.set(145, -175, 0);
// scene.add(sphere);

// //

// requestAnimationFrame(render)

// // // // // // // T E S T I N G // // // // // // //

let canvas, renderer, camera, scene, orbit, baseComposer, bloomComposer, overlayComposer, finalComposer

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_LAYER );

const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

function initThree() {

    // grab canvas
    canvas = document.querySelector('#canvas');

    // scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xEBE2DB, 0.00003);

    // camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 5000000 );
    camera.position.set(0, 500, 500);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    // map orbit
    orbit = new OrbitControls(camera, canvas)
    orbit.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    orbit.dampingFactor = 0.05;
    orbit.screenSpacePanning = false;
    orbit.minDistance = 1;
    orbit.maxDistance = 16384;
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
                // overlayTexture: { value: overlayComposer.renderTarget2.texture }
            },
            vertexShader: CompositionShader.vertex,
            fragmentShader: CompositionShader.fragment,
            defines: {}
        } ), 'baseTexture'
    );
    // mixPass.needsSwap = true;

    const outputPass = new OutputPass();

    finalComposer = new EffectComposer( renderer );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( mixPass );
    finalComposer.addPass( outputPass );

    // // base layer composer
    // baseComposer = new EffectComposer( renderer )
    // baseComposer.addPass( renderScene )
    // baseComposer.addPass(finalPass)
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

async function render() {

    orbit.update()

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

    galaxy.updateScale(camera)

    // Run each pass of the render pipeline
    renderPipeline()

    requestAnimationFrame(render)

}

function renderPipeline() {

    scene.traverse( darkenNonBloomed );
    // camera.layers.enable(BLOOM_LAYER)
    bloomComposer.render();
    // camera.layers.set(BASE_LAYER)
    scene.traverse( restoreMaterial );

    // render the entire scene, then render bloom scene on top
    // camera.layers.set(BASE_LAYER)
    finalComposer.render();

    // // Render bloom
    // camera.layers.set(BLOOM_LAYER)
    // bloomComposer.render()

    // // Render overlays
    // camera.layers.set(OVERLAY_LAYER)
    // overlayComposer.render()

    // // Render normal
    // camera.layers.set(BASE_LAYER)
    // baseComposer.render()

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
let axes = new THREE.AxesHelper(5.0)
scene.add(axes)

let galaxy = new Galaxy(scene)

// Create a BoxGeometry
let geometry = new THREE.BoxGeometry(0.5, 0.5, 500); // Width, Height, Depth
let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const parallelepiped = new THREE.Mesh(geometry, material);
parallelepiped.position.set(145, -175, 0); // solar system coordinates
scene.add(parallelepiped);

// 

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../../graphics/sun.jpg', () => {
    console.log('Texture loaded');
});
geometry = new THREE.SphereGeometry(1, 16, 16);
material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);

// sphere.layers.set(OVERLAY_LAYER)
sphere.layers.enable(BLOOM_LAYER)
// sphere.layers.set(BASE_LAYER)

sphere.position.set(145, -175, 0);
scene.add(sphere);

requestAnimationFrame(render)

// // // // // // // T E S T I N G // // // // // // //

// function initThree() {

//     // grab canvas
//     canvas = document.querySelector('#canvas');

//     // scene
//     scene = new THREE.Scene();
//     // scene.fog = new THREE.FogExp2(0xEBE2DB, 0.00003);

//     // camera
//     camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 5000000 );
//     camera.position.set(10, 10, 10);
//     // camera.up.set(0, 0, 1);
//     camera.lookAt(0, 0, 0);

//     // map orbit
//     // orbit = new MapControls(camera, canvas)
//     orbit = new OrbitControls(camera, canvas)
//     orbit.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
//     orbit.dampingFactor = 0.05;
//     orbit.screenSpacePanning = false;
//     orbit.minDistance = 1;
//     orbit.maxDistance = 16384;
//     orbit.maxPolarAngle = (Math.PI / 2) - (Math.PI / 360)

//     initRenderPipeline()

// }

// function initRenderPipeline() {

//     // Assign Renderer
//     renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         canvas,
//         logarithmicDepthBuffer: true,
//     })
//     renderer.setPixelRatio( window.devicePixelRatio )
//     renderer.setSize( window.innerWidth, window.innerHeight )
//     renderer.outputEncoding = THREE.sRGBEncoding
//     renderer.toneMapping = THREE.ACESFilmicToneMapping
//     renderer.toneMappingExposure = 0.5

//     // General-use rendering pass for chaining
//     const renderScene = new RenderPass( scene, camera )

//     // // Rendering pass for bloom
//     const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
//     bloomPass.threshold = BLOOM_PARAMS.bloomThreshold
//     bloomPass.strength = BLOOM_PARAMS.bloomStrength
//     bloomPass.radius = BLOOM_PARAMS.bloomRadius

//     // // bloom composer
//     bloomComposer = new EffectComposer(renderer)
//     bloomComposer.renderToScreen = false
//     bloomComposer.addPass(renderScene)
//     bloomComposer.addPass(bloomPass)

//     // // overlay composer
//     overlayComposer = new EffectComposer(renderer)
//     overlayComposer.renderToScreen = false
//     overlayComposer.addPass(renderScene)

//     // Shader pass to combine base layer, bloom, and overlay layers
//     const finalPass = new ShaderPass(
//         new THREE.ShaderMaterial( {
//             uniforms: {
//                 baseTexture: { value: null },
//                 bloomTexture: { value: bloomComposer.renderTarget2.texture },
//                 overlayTexture: { value: overlayComposer.renderTarget2.texture }
//             },
//             vertexShader: CompositionShader.vertex,
//             fragmentShader: CompositionShader.fragment,
//             defines: {}
//         } ), 'baseTexture'
//     );
//     finalPass.needsSwap = true;

//     // base layer composer
//     baseComposer = new EffectComposer( renderer )
//     baseComposer.addPass( renderScene )
//     // baseComposer.addPass(finalPass)
// }

// // function resizeRendererToDisplaySize(renderer) {
// //     const canvas = renderer.domElement;
// //     const width = canvas.clientWidth;
// //     const height = canvas.clientHeight;
// //     const needResize = canvas.width !== width || canvas.height !== height;
// //     if (needResize) {
// //       renderer.setSize(width, height, false);
// //     }
// //     return needResize;
// // }

// async function render() {

//     orbit.update()

//     // fix buffer size
//     // if (resizeRendererToDisplaySize(renderer)) {
//     //     const canvas = renderer.domElement;
//     //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     //     camera.updateProjectionMatrix();
//     // }

//     // fix aspect ratio
//     const canvas = renderer.domElement;
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();

//     // galaxy.updateScale(camera)

//     // Run each pass of the render pipeline
//     renderPipeline()

//     requestAnimationFrame(render)

// }

// function renderPipeline() {

//     // Render bloom
//     camera.layers.set(BLOOM_LAYER)
//     bloomComposer.render()

//     // // Render overlays
//     // camera.layers.set(OVERLAY_LAYER)
//     // overlayComposer.render()

//     // Render normal
//     camera.layers.set(BASE_LAYER)
//     baseComposer.render()

// }

// initThree()
// let axes = new THREE.AxesHelper(5.0)
// scene.add(axes)

// // let galaxy = new Galaxy(scene)

// //

// // const textureLoader = new THREE.TextureLoader();
// // const texture = textureLoader.load('../../graphics/stars.jpg');

// // let geometry = new THREE.SphereGeometry(900, 60, 60);
// // let material = new THREE.MeshBasicMaterial({
// //     map: texture,
// //     side: THREE.BackSide
// // });
// // let skybox = new THREE.Mesh(geometry, material);
// // scene.add(skybox);

// // Create a BoxGeometry
// // let geometry = new THREE.BoxGeometry(0.5, 0.5, 500); // Width, Height, Depth

// // // Create a MeshBasicMaterial with red color
// // let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// // // Combine the geometry and material into a Mesh
// // const parallelepiped = new THREE.Mesh(geometry, material);

// // // Set the position of the mesh
// // parallelepiped.position.set(145, -175, 0); // solar system coordinates

// // // Add the mesh to the scene
// // scene.add(parallelepiped);

// // 

// // const textureLoader = new THREE.TextureLoader();
// // const texture = textureLoader.load('../../graphics/sun.jpg', () => {
// //     console.log('Texture loaded');
// // });
// // geometry = new THREE.SphereGeometry(1, 16, 16);
// // material = new THREE.MeshBasicMaterial({ map: texture });
// // material = new THREE.SpriteMaterial({map: texture});
// // // const sphere = new THREE.Mesh(geometry, material);
// // const sphere = new THREE.Sprite(material);
// // sphere.position.set(145, -175, 0);
// // scene.add(sphere);

// let star = new Star(new THREE.Vector3(0,0,0));
// star.toThreeObject(scene);




// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load('../../graphics/sun.jpg', () => {
//     console.log('Texture loaded');
// });

// const geometry = new THREE.SphereGeometry(1, 16, 16);
// const material = new THREE.MeshBasicMaterial({ map: texture });
// const sphere = new THREE.Mesh(geometry, material);
// sphere.position.copy(new THREE.Vector3(10, 0, 0))

// scene.add(sphere)

// // const texture = new THREE.TextureLoader().load('../graphics/sprite120.png')
// // const material = new THREE.SpriteMaterial({map: texture, color: 0xffcc6f})

// // let sprite = new THREE.Sprite(material)
// // sprite.scale.multiplyScalar(2)
// // sprite.position.copy(new THREE.Vector3(0,0,0));

// // scene.add(sprite)



// // //