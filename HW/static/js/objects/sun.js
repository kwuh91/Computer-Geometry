import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, SCALED_SUN_RADIUS, REAL_SUN_DIAMETER, SCALED_SUN_ROTATIONAL_SPEED, SUN_LIGHT_INTENSITY } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS, DELTA_T } from '../config/renderConfig.js'
import { clamp, degrees_to_radians, get_scaled_planet_size, get_scaled_planet_to_sun_dist, get_scaled_planet_orbital_speed, get_scaled_planet_rotational_speed } from '../utils.js'

const GRAPHICS_PATH = '../../graphics/sun'

export class Sun {

    constructor(scene) {
        const initialPosition = new THREE.Vector3(SUN_X, SUN_Y, SUN_Z)

        // make sun source of light
        let sunLight = new THREE.PointLight(0xffffff, SUN_LIGHT_INTENSITY, 0);
        sunLight.position.copy(initialPosition); 
        scene.add(sunLight);

        // const sphereSize = 10;
        // const pointLightHelper = new THREE.PointLightHelper( sunLight, sphereSize );
        // pointLightHelper.layers.enable(1)
        // scene.add( pointLightHelper );

        this.radius = SCALED_SUN_RADIUS
        this.rotationalSpeed = SCALED_SUN_ROTATIONAL_SPEED

        // create sun object
        let geometry = new THREE.SphereGeometry(this.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        let texture = new THREE.TextureLoader().load( `${GRAPHICS_PATH}/sun.jpg`)
        let material = new THREE.MeshBasicMaterial({ map: texture });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.layers.enable(BLOOM_LAYER)
        mesh.position.copy(initialPosition)
        scene.add(mesh)

        this.light = sunLight
        this.obj = mesh
    }

    // updateScale(camera) {
    //     let dist = this.obj.position.distanceTo(camera.position) / 250

    //     // update size
    //     let size = dist * SCALED_SUN_RADIUS
    //     size = clamp(size, SUN_MIN, SUN_MAX)
    //     this.obj?.scale.copy(new THREE.Vector3(size, size, size))
    // }

    rotate() { 
        // rotating around itself
        let omega = this.rotationalSpeed / this.radius
        let deltaPhi = omega * DELTA_T

        this.obj.rotation.z += deltaPhi;
    }
}
