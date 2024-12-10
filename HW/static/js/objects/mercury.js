import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, REAL_MERCURY_TO_SUN_DISTANCE, REAL_MERCURY_DIAMETER, REAL_MERCURY_ORBITAL_SPEED, REAL_MERCURY_ROTATIONAL_SPEED, SCALED_MERCURY_TO_SUN_DISTANCE } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS, DELTA_T } from '../config/renderConfig.js'
import { clamp, degrees_to_radians, get_scaled_planet_size, get_scaled_planet_to_sun_dist, get_scaled_planet_orbital_speed, get_scaled_planet_rotational_speed } from '../utils.js'

const GRAPHICS_PATH = '../../graphics/mercury'
const textureLoader = new THREE.TextureLoader();

export class Mercury {

    constructor(scene) {
        this.phi = 0
        
        this.toParentDistance = SCALED_MERCURY_TO_SUN_DISTANCE
        this.radius = get_scaled_planet_size(REAL_MERCURY_DIAMETER)
        this.orbitalSpeed = get_scaled_planet_orbital_speed(REAL_MERCURY_ORBITAL_SPEED)
        this.rotationalSpeed = get_scaled_planet_rotational_speed(REAL_MERCURY_ROTATIONAL_SPEED)

        let x = SUN_X + this.toParentDistance * Math.cos(this.phi)
        let y = SUN_Y + this.toParentDistance * Math.sin(this.phi)
        let z = SUN_Z

        let initialPosition = new THREE.Vector3(x, y, z)

        let geometry = new THREE.SphereGeometry(this.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        let texture = textureLoader.load(`${GRAPHICS_PATH}/mercury.jpg`)
        let material = new THREE.MeshStandardMaterial({map: texture})

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(initialPosition)
        mesh.rotation.x = Math.PI/2

        this.obj = mesh

        scene.add(this.obj)
    }

    rotate() { 
        // rotating around the sun
        let omega = this.orbitalSpeed / this.toParentDistance
        let deltaPhi = omega * DELTA_T
        this.phi = this.phi + deltaPhi;

        let x = SUN_X + this.toParentDistance * Math.cos(this.phi)
        let y = SUN_Y + this.toParentDistance * Math.sin(this.phi)
        let z = SUN_Z

        let newPosition = new THREE.Vector3(x, y, z)

        // console.log(`new earth position: x: ${newPosition.x}; y: ${newPosition.y}; z: ${newPosition.z}`)

        this.obj?.position.copy(newPosition);

        // console.log(`new earth position: x: ${this.obj?.position.x}; y: ${this.obj?.position.y}; z: ${this.obj?.position.z}`)

        // rotating around itself
        // this.obj.children[0].rotation.y += (1/16) * EARTH_ROTATION_SPEED;
        // this.obj.rotation.y += (1/20) * EARTH_ROTATION_SPEED;

        omega = this.rotationalSpeed / this.radius
        deltaPhi = omega * DELTA_T

        this.obj.rotation.y += deltaPhi; // main body
    }
}
