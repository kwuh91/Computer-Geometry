import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, REAL_SATURN_TO_SUN_DISTANCE, REAL_SATURN_DIAMETER, REAL_SATURN_ORBITAL_SPEED, REAL_SATURN_ROTATIONAL_SPEED, REAL_SATURN_RINGS_DIAMETER } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS, DELTA_T, THETA_SEGMENTS } from '../config/renderConfig.js'
import { clamp, degrees_to_radians, get_scaled_planet_size, get_scaled_planet_to_sun_dist, get_scaled_planet_orbital_speed, get_scaled_planet_rotational_speed } from '../utils.js'

const GRAPHICS_PATH = '../../graphics/saturn'
const textureLoader = new THREE.TextureLoader();

export class Saturn {

    constructor(scene) {
        this.phi = 0
        
        this.toParentDistance = get_scaled_planet_to_sun_dist(REAL_SATURN_TO_SUN_DISTANCE)
        this.radius = get_scaled_planet_size(REAL_SATURN_DIAMETER)
        this.orbitalSpeed = get_scaled_planet_orbital_speed(REAL_SATURN_ORBITAL_SPEED)
        this.rotationalSpeed = get_scaled_planet_rotational_speed(REAL_SATURN_ROTATIONAL_SPEED)

        this.radiusRings = get_scaled_planet_size(REAL_SATURN_RINGS_DIAMETER)

        let x = SUN_X + this.toParentDistance * Math.cos(this.phi)
        let y = SUN_Y + this.toParentDistance * Math.sin(this.phi)
        let z = SUN_Z

        let initialPosition = new THREE.Vector3(x, y, z)

        // let geometryRings = new THREE.RingGeometry(this.radius * 1.5, this.radiusRings, THETA_SEGMENTS)
        // let textureRings = textureLoader.load(`${GRAPHICS_PATH}/rings.png`)
        // let materialRings = new THREE.MeshStandardMaterial({map: textureRings})
    
        // let meshRings = new THREE.Mesh(geometryRings, materialRings);
        // meshRings.position.copy(initialPosition)
        // // meshRings.rotation.x = Math.PI/2

        // let geometryRings = new THREE.RingGeometry(this.radius * 1.5, this.radiusRings, THETA_SEGMENTS)

        let geometryRings = new THREE.RingGeometry(this.radius * 1.1, this.radiusRings, THETA_SEGMENTS);
        var pos = geometryRings.attributes.position;
        var v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++){
            v3.fromBufferAttribute(pos, i);
            geometryRings.attributes.uv.setXY(i, v3.length() < 4*4 ? 0 : 1, 1);
        }

        let textureRings = textureLoader.load(`${GRAPHICS_PATH}/rings.png`);
        let materialRings = new THREE.MeshBasicMaterial({
            map: textureRings,
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true
        });

        let meshRings = new THREE.Mesh(geometryRings, materialRings);
        meshRings.position.copy(initialPosition)
        // meshRings.rotation.x = Math.PI/2
        meshRings.rotateX(Math.PI/2 * 1.7);

        this.objRings = meshRings

        let geometry = new THREE.SphereGeometry(this.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        let texture = textureLoader.load(`${GRAPHICS_PATH}/saturn.jpg`)
        let material = new THREE.MeshStandardMaterial({map: texture})

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(initialPosition)
        mesh.rotation.x = Math.PI/2
        mesh.rotateX(Math.PI/2 * 1.7);

        this.obj = mesh

        scene.add(this.obj)
        scene.add(this.objRings)
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
        this.objRings?.position.copy(newPosition);

        // console.log(`new earth position: x: ${this.obj?.position.x}; y: ${this.obj?.position.y}; z: ${this.obj?.position.z}`)

        // rotating around itself
        // this.obj.children[0].rotation.y += (1/16) * EARTH_ROTATION_SPEED;
        // this.obj.rotation.y += (1/20) * EARTH_ROTATION_SPEED;

        omega = this.rotationalSpeed / this.radius
        deltaPhi = omega * DELTA_T

        this.obj.rotation.y += deltaPhi; // main body
        this.objRings.rotation.z += deltaPhi; // rings
    }
}
