import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, SUN_RADIUS, SUN_ROTATION_SPEED } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS } from '../config/renderConfig.js'
import { clamp } from '../utils.js'

export class Sun {

    constructor(scene) {
        this.position = new THREE.Vector3(SUN_X, SUN_Y, SUN_Z)

        // make sun source of light
        let sunLight = new THREE.PointLight(0xffffff, 1e3, 0);
        sunLight.position.copy(this.position); 
        scene.add(sunLight);

        // const sphereSize = 10;
        // const pointLightHelper = new THREE.PointLightHelper( sunLight, sphereSize );
        // pointLightHelper.layers.enable(1)
        // scene.add( pointLightHelper );

        // create sun object
        let geometry = new THREE.SphereGeometry(SUN_RADIUS, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        let texture = new THREE.TextureLoader().load('../../graphics/sun.jpg')
        let material = new THREE.MeshBasicMaterial({ map: texture });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.layers.enable(BLOOM_LAYER)
        mesh.position.copy(this.position)
        scene.add(mesh)

        this.light = sunLight
        this.obj = mesh
    }

    updateScale(camera) {
        let dist = this.position.distanceTo(camera.position) / 250

        // update sun size
        let sunSize = dist * SUN_RADIUS
        sunSize = clamp(sunSize, SUN_MIN, SUN_MAX)
        this.obj?.scale.copy(new THREE.Vector3(sunSize, sunSize, sunSize))
    }

    rotate() { 
        // rotating around itself
        this.obj.rotation.z += SUN_ROTATION_SPEED;
    }
}
