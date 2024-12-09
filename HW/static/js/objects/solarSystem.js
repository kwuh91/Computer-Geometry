import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, GALAXY_SCALE_FACTOR } from '../config/solarSystemConfig.js'
import { SUN_MIN, SUN_MAX } from '../config/renderConfig.js'

import { clamp } from '../utils.js'

import { Hint } from './hint.js';
import { Sun } from './sun.js';
import { Earth } from './earth.js';
// import { Moon } from './moon.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const GRAPHICS_PATH = '../../graphics/models'

const loader = new GLTFLoader();

export class SolarSystem {

    constructor(scene, showHint=true) {

        this.scene = scene
        this.showHint = showHint

        if (this.showHint) this.hint = new Hint(scene);
        
        this.sun   = new Sun(scene);
        this.earth = new Earth(scene);
        // let moon  = new Moon(scene, earth);

        this.celestialBodies = [this.sun, this.earth];

        this.createStarsModel();
        // this.createSkyBox();

        this.solarLight = new THREE.AmbientLight( 0x404040, 10 );
        this.scene.add(this.solarLight);
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

    createStarsModel() {    

        // Load the GLB file
        loader.load(`${GRAPHICS_PATH}/stars.glb`, (gltf) => {
            const model = gltf.scene;

            // Scale the model
            model.scale.set(GALAXY_SCALE_FACTOR, GALAXY_SCALE_FACTOR, GALAXY_SCALE_FACTOR); 

            // Move the model
            model.position.set(SUN_X + 0 - 1.45*GALAXY_SCALE_FACTOR, 
                               SUN_Y + 0 - 1.45*GALAXY_SCALE_FACTOR, 
                               SUN_Z + 0 - 1.45*GALAXY_SCALE_FACTOR); 

            model.rotateX(Math.PI/2);

            model.layers.enable(1);

            this.scene.add(model);

        }, undefined, (error) => {
            console.error(error);
        });

    }

    updateScale(camera) {
        for (let body of this.celestialBodies) {
            let dist = body.obj.position.distanceTo(camera.position) / 250
        
            // update size
            let size = dist * body.radius
            size = clamp(size, SUN_MIN, SUN_MAX)
            body.obj?.scale.copy(new THREE.Vector3(size, size, size))
        }

        if (this.showHint) this.hint.updateScale(camera);
    }

    rotate() {
        for (let body of this.celestialBodies) {
            body.rotate();
        }
    }
}
