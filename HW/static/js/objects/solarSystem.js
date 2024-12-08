import * as THREE from 'three'

import { Hint } from './hint.js';
import { Sun } from './sun.js';
import { Earth } from './earth.js';

export class SolarSystem {

    constructor(scene, showHint=true) {

        this.scene = scene
        this.showHint = showHint

        if (this.showHint) this.hint = new Hint(scene);
        
        this.sun = new Sun(scene);
        this.earth = new Earth(scene);

        // this.stars = this.generateObject(NUM_STARS, (pos) => new Star(pos))
        // this.haze = this.generateObject(NUM_STARS * HAZE_RATIO, (pos) => new Haze(pos))

        // this.stars.forEach((star) => star.toThreeObject(scene))
        // this.haze.forEach((haze) => haze.toThreeObject(scene))

        this.solarLight = new THREE.AmbientLight( 0x404040, 10 );
        this.scene.add(this.solarLight);
    }

    updateScale(camera) {
        this.sun.updateScale(camera);
        this.earth.updateScale(camera);

        if (this.showHint) this.hint.updateScale(camera);
    }

    rotate() {
        this.sun.rotate()
        this.earth.rotate();
    }
}
