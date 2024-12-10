import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, REAL_MOON_TO_EARTH_DISTANCE, REAL_MOON_DIAMETER, SPACE_SHIP_SPEED, SPACE_SHIP_SCALE_FACTOR } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS, DELTA_T } from '../config/renderConfig.js'
import { clamp, get_scaled_planet_size, get_scaled_planet_to_sun_dist, get_scaled_planet_orbital_speed, get_scaled_planet_rotational_speed } from '../utils.js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const GRAPHICS_PATH = '../../graphics/models'
const loader = new GLTFLoader();

export class SpaceShip {

    constructor(scene, marsInstance) {

        this.scene = scene
        this.marsInstance = marsInstance

        this.phi = 0;
        this.theta = 0;
        this.speed = SPACE_SHIP_SPEED

        const offset = new THREE.Vector3(
            0,
            marsInstance.radius, 
            marsInstance.radius,
        ); 
        this.position = marsInstance.obj.position.clone().add(offset);

        // Create directional light with increased intensity and narrower beam
        this.spotLight = new THREE.SpotLight(0x008080, 0.5); // Increase intensity
        this.spotLight.position.copy(this.position);
        this.spotLight.angle = Math.PI / 8;
        this.spotLight.target = marsInstance.obj;

        this.scene.add(this.spotLight);
        this.scene.add(this.spotLight.target);

        this.modelLoaded = this.createModel();
    }

    createModel() {    
        return new Promise((resolve, reject) => {
            // Load the GLB file
            loader.load(`${GRAPHICS_PATH}/ufo2.glb`, (gltf) => {
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

    rotate() { 
        if (this.model) {
            // console.log(`model position: ${this.model.position.x}`)

            const rho = this.marsInstance.radius * 0.7;

            // let rho = this.model.position.distanceTo(this.marsInstance.obj.position);
            let omega = this.speed / rho

            this.phi += omega * DELTA_T;
            this.theta -= omega * DELTA_T;

            let x = rho * Math.cos(this.theta) * Math.sin(this.phi)
            let y = rho * Math.sin(this.theta) * Math.sin(this.phi)
            let z = rho * Math.cos(this.phi)

            // console.log(`space ship xyz: ${x, y, z}`)

            let newPosition = new THREE.Vector3(x, y, z).add(this.marsInstance.obj.position);

            // console.log(`new space ship position: ${newPosition.x, newPosition.y}`)

            this.model.position.copy(newPosition);

            this.model.lookAt(this.marsInstance.obj.position)
            this.model.rotateX(-Math.PI/2);

            // Update the directional light's position
            this.spotLight.position.copy(newPosition);
        } else {
            console.error('Model is not loaded yet.');
        }
    }
}
