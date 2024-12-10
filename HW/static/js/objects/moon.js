import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, REAL_MOON_TO_EARTH_DISTANCE, REAL_MOON_DIAMETER, REAL_MOON_ORBITAL_SPEED, REAL_MOON_ROTATIONAL_SPEED } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS, DELTA_T } from '../config/renderConfig.js'
import { clamp, get_scaled_planet_size, get_scaled_planet_to_sun_dist, get_scaled_planet_orbital_speed, get_scaled_planet_rotational_speed } from '../utils.js'

const GRAPHICS_PATH = '../../graphics/moon'
const textureLoader = new THREE.TextureLoader();

export class Moon {

    constructor(scene, earthInstance) {
        this.earthInstance = earthInstance
        
        this.phi = 0
        
        // this.toParentDistance = get_scaled_satellite_to_parent_dist(REAL_MOON_TO_EARTH_DISTANCE)
        this.toParentDistance = get_scaled_planet_to_sun_dist(REAL_MOON_TO_EARTH_DISTANCE)
        this.radius = get_scaled_planet_size(REAL_MOON_DIAMETER)
        this.orbitalSpeed = get_scaled_planet_orbital_speed(REAL_MOON_ORBITAL_SPEED)
        this.rotationalSpeed = get_scaled_planet_rotational_speed(REAL_MOON_ROTATIONAL_SPEED)

        let x = this.earthInstance.obj.position.x + this.toParentDistance * Math.cos(this.phi)
        let y = this.earthInstance.obj.position.y + this.toParentDistance * Math.sin(this.phi)
        let z = this.earthInstance.obj.position.z 

        let initialPosition = new THREE.Vector3(x, y, z)

        let geometry = new THREE.SphereGeometry(this.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        let texture = textureLoader.load(`${GRAPHICS_PATH}/moon.jpg`)
        let material = new THREE.MeshStandardMaterial({map: texture})

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(initialPosition)
        mesh.rotation.x = Math.PI/2

        // mesh.layers.enable(0)

        this.obj = mesh

        scene.add(this.obj)
    }

    rotate() { 
        // rotating around the sun
        let omega = this.orbitalSpeed / this.toParentDistance
        let deltaPhi = omega * DELTA_T
        this.phi = this.phi + deltaPhi;

        let x = this.earthInstance.obj.position.x + this.toParentDistance * Math.cos(this.phi)
        let y = this.earthInstance.obj.position.y + this.toParentDistance * Math.sin(this.phi)
        let z = this.earthInstance.obj.position.z 

        let newPosition = new THREE.Vector3(x, y, z)

        this.obj?.position.copy(newPosition);

        // rotating around itself
        omega = this.rotationalSpeed / this.radius
        deltaPhi = omega * DELTA_T

        this.obj.rotation.z += deltaPhi; // main body
    }
}
