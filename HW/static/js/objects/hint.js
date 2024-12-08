import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, HINT_WIDTH, HINT_HEIGHT, HINT_DEPTH, HINT_COLOR } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN } from '../config/renderConfig.js'
import { clamp } from '../utils.js'

export class Hint {

    constructor(scene) {
        this.position = new THREE.Vector3(SUN_X, SUN_Y, SUN_Z)

        let geometry = new THREE.BoxGeometry(HINT_WIDTH, HINT_HEIGHT, HINT_DEPTH);

        let material = new THREE.MeshBasicMaterial({ color: HINT_COLOR });
  
        let mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(this.position)

        this.obj = mesh

        scene.add(mesh)
    }

    updateScale(camera) {
        let dist = this.position.distanceTo(camera.position) / 1000

        // update sun size
        let hintSize = dist * HINT_WIDTH
        hintSize = clamp(hintSize, 0, HINT_WIDTH)
        if (hintSize <= 0.03) {
            hintSize = 0
        }
        this.obj?.scale.copy(new THREE.Vector3(hintSize, hintSize, HINT_DEPTH))
    }
}
