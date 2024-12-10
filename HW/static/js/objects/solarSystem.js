import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, GALAXY_SCALE_FACTOR } from '../config/solarSystemConfig.js'
import { SUN_MIN, SUN_MAX } from '../config/renderConfig.js'

import { clamp } from '../utils.js'

import { Hint } from './hint.js';
import { Sun } from './sun.js';
import { Mercury } from './mercury.js';
import { Venus } from './venus.js';
import { Earth } from './earth.js';
import { Moon } from './moon.js';
import { Mars } from './mars.js';
import { SpaceShip } from './spaceShip.js';
import { Jupiter } from './jupiter.js';
import { Saturn } from './saturn.js';
import { Uranus } from './uranus.js';
import { Neptune } from './neptune.js';
import { Pluto } from './pluto.js';
import { PlanetNine } from './planetNine.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';


const GRAPHICS_PATH = '../../graphics/models'

const loader = new GLTFLoader();
// const loader = new PLYLoader();

export class SolarSystem {

    constructor(scene, showHint=true) {

        this.scene = scene
        this.showHint = showHint

        if (this.showHint) this.hint = new Hint(scene);
        
        this.sun = new Sun(scene);
        this.mercury = new Mercury(scene);
        this.venus = new Venus(scene);
        this.earth = new Earth(scene);
        this.moon = new Moon(scene, this.earth);
        this.mars = new Mars(scene);
        this.spaceShip = new SpaceShip(scene, this.mars);
        this.jupiter = new Jupiter(scene);
        this.saturn = new Saturn(scene);
        this.uranus = new Uranus(scene);
        this.neptune = new Neptune(scene);
        this.pluto = new Pluto(scene);
        this.planetNine = new PlanetNine(scene);
            
        // this.celestialBodies = [this.sun, this.earth, this.moon];
        this.celestialBodies = {
            sun: this.sun,
            mercury: this.mercury,
            venus: this.venus,
            earth: this.earth,
            moon: this.moon,
            mars: this.mars,
            jupiter: this.jupiter,
            saturn: this.saturn,
            uranus: this.uranus,
            neptune: this.neptune,
            pluto: this.pluto,
            planetNine: this.planetNine
        }

        this.createStarsModel();
        // this.createSkyBox();

        this.solarLight = new THREE.AmbientLight( 0x404040, 10 );
        this.scene.add(this.solarLight);
    }

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

            // model.layers.enable(1);

            this.scene.add(model);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.needsUpdate = true;
                }
            });

        }, undefined, (error) => {
            console.error(error);
        });

    }

    updateScale(camera) {
        // for (let body of this.celestialBodies) {
        //     let dist = body.obj.position.distanceTo(camera.position) / 250
        
        //     // update size
        //     let size = dist * body.radius
        //     size = clamp(size, SUN_MIN, SUN_MAX)
        //     body.obj?.scale.copy(new THREE.Vector3(size, size, size))
        // }
        for (let bodyName in this.celestialBodies) {
            let body = this.celestialBodies[bodyName]
            // console.log(`name: ${bodyName}, radius: ${body.radius}`)
            let dist = body.obj.position.distanceTo(camera.position) / 250
        
            // update size
            let size = dist * body.radius
            size = clamp(size, SUN_MIN, SUN_MAX)
            body.obj?.scale.copy(new THREE.Vector3(size, size, size))

            if (bodyName == 'saturn') {
                body.objRings?.scale.copy(new THREE.Vector3(size, size, size))
            }
        }

        if (this.showHint) this.hint.updateScale(camera);
    }

    rotate() {
        for (let bodyName in this.celestialBodies) {
            let body = this.celestialBodies[bodyName];
            body.rotate();
        }

        this.spaceShip.rotate();
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
