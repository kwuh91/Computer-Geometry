import * as THREE from 'three'

import { Sun } from './sun.js';
import { Hint } from './hint.js';

export class SolarSystem {

    constructor(scene, showHint=true) {

        this.scene = scene
        this.showHint = showHint

        this.sun = new Sun(scene);
        if (this.showHint) this.hint = new Hint(scene);


        // this.stars = this.generateObject(NUM_STARS, (pos) => new Star(pos))
        // this.haze = this.generateObject(NUM_STARS * HAZE_RATIO, (pos) => new Haze(pos))

        // this.stars.forEach((star) => star.toThreeObject(scene))
        // this.haze.forEach((haze) => haze.toThreeObject(scene))
    }

    updateScale(camera) {
        this.sun.updateScale(camera);
        if (this.showHint) this.hint.updateScale(camera);
    }

}
