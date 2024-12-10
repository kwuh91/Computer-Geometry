import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, BLACK_HOLE_SCALE_FACTOR, SUN_LIGHT_INTENSITY } from '../config/solarSystemConfig.js'
import { SUN_MIN, SUN_MAX } from '../config/renderConfig.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

const GRAPHICS_PATH = '../../graphics/models'

const loader = new GLTFLoader();
// const loader = new PLYLoader();

export class BlackHole {

    constructor(scene) {

        this.scene = scene

        this.position = new THREE.Vector3(
            SUN_X + 10*BLACK_HOLE_SCALE_FACTOR, 
            SUN_Y + 10*BLACK_HOLE_SCALE_FACTOR, 
            SUN_Z 
        )

        // // make light up black hole
        // let blackHoleLight = new THREE.PointLight(0xffffff, 1e2, 0);
        // blackHoleLight.position.copy(this.position); 
        // scene.add(blackHoleLight);

        this.modelLoaded = this.createModel();
    }

    createModel() {    
        return new Promise((resolve, reject) => {
            // Load the GLB file
            loader.load(`${GRAPHICS_PATH}/blackhole.glb`, (gltf) => {
                this.model = gltf.scene;

                // Scale the model
                this.model.scale.set(BLACK_HOLE_SCALE_FACTOR, BLACK_HOLE_SCALE_FACTOR, BLACK_HOLE_SCALE_FACTOR); 

                // Move the model
                this.model.position.copy(this.position); 

                this.model.rotateX(Math.PI/2 * 1.2);
                // this.model.rotateZ(Math.PI/6);

                // this.model.layers.enable(2);

                this.scene.add(this.model);

                // model.traverse((child) => {
                //     if (child.isMesh) {
                //         child.material.needsUpdate = true;
                //     }
                // });
                
                resolve();
            }, undefined, (error) => {
                console.error(error);
                reject(error);
            });
        });
    }

    // updateScale(camera) {
    //     // for (let body of this.celestialBodies) {
    //     //     let dist = body.obj.position.distanceTo(camera.position) / 250
        
    //     //     // update size
    //     //     let size = dist * body.radius
    //     //     size = clamp(size, SUN_MIN, SUN_MAX)
    //     //     body.obj?.scale.copy(new THREE.Vector3(size, size, size))
    //     // }
    //     for (let bodyName in this.celestialBodies) {
    //         let body = this.celestialBodies[bodyName]
    //         // console.log(`name: ${bodyName}, radius: ${body.radius}`)
    //         let dist = body.obj.position.distanceTo(camera.position) / 250
        
    //         // update size
    //         let size = dist * body.radius
    //         size = clamp(size, SUN_MIN, SUN_MAX)
    //         body.obj?.scale.copy(new THREE.Vector3(size, size, size))
    //     }

    //     if (this.showHint) this.hint.updateScale(camera);
    // }

    rotate() {
        if (this.model) {
            let rotationFactor = 1e-3;

            this.model.rotation.y += rotationFactor;
            // this.model.rotation.y += rotationFactor/6;
        } else {
            console.error('Model is not loaded yet.');
        }
    }
}

    // createSkyBox() {
    //     // Load the GLB file
    //     loader.load(`${GRAPHICS_PATH}/skybox.glb`, (gltf) => {
    //         const model = gltf.scene;

    //         let mult = 10000;

    //         // Scale the model
    //         model.scale.set(mult, mult, mult); 

    //         // Move the model
    //         model.position.set(SUN_X + 0, 
    //                            SUN_Y + 0, 
    //                            SUN_Z + 0); 

    //         model.rotateX(Math.PI/2);

    //         model.layers.enable(1);

    //         this.scene.add(model);

    //     }, undefined, (error) => {
    //         console.error(error);
    //     });
    // }