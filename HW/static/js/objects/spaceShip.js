import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, REAL_MOON_TO_EARTH_DISTANCE, REAL_MOON_DIAMETER, REAL_MOON_ORBITAL_SPEED, SPACE_SHIP_SCALE_FACTOR } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS, DELTA_T } from '../config/renderConfig.js'
import { clamp, get_scaled_planet_size, get_scaled_planet_to_sun_dist, get_scaled_planet_orbital_speed, get_scaled_planet_rotational_speed } from '../utils.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const GRAPHICS_PATH = '../../graphics/models'
const loader = new GLTFLoader();

export class SpaceShip {

    constructor(scene, marsInstance) {

        this.scene = scene

        const offset = new THREE.Vector3(
            0,
            marsInstance.radius * 1.1, 
            marsInstance.radius * 1.1,
        ); 
        this.position = marsInstance.obj?.position.add(offset);

        // // make light up black hole
        // let blackHoleLight = new THREE.PointLight(0xffffff, 1e2, 0);
        // blackHoleLight.position.copy(this.position); 
        // scene.add(blackHoleLight);

        this.modelLoaded = this.createModel();
    }

    createModel() {    
        return new Promise((resolve, reject) => {
            // Load the GLB file
            loader.load(`${GRAPHICS_PATH}/spaceship.glb`, (gltf) => {
                this.model = gltf.scene;

                // Scale the model
                this.model.scale.set(SPACE_SHIP_SCALE_FACTOR, SPACE_SHIP_SCALE_FACTOR, SPACE_SHIP_SCALE_FACTOR); 

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

    // rotate() { 
    //     if (this.model) {
            
    //     } else {
    //         console.error('Model is not loaded yet.');
    //     }
    // }
}
