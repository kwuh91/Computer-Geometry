import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, REAL_EARTH_TO_SUN_DISTANCE, REAL_EARTH_DIAMETER, REAL_EARTH_ORBITAL_SPEED, REAL_EARTH_ROTATIONAL_SPEED } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS, DELTA_T } from '../config/renderConfig.js'
import { clamp, degrees_to_radians, get_scaled_planet_size, get_scaled_planet_to_sun_dist, get_scaled_planet_orbital_speed, get_scaled_planet_rotational_speed } from '../utils.js'

const GRAPHICS_PATH = '../../graphics/earth'

export class Earth {

    constructor(scene) {
        this.phi = 0
        
        this.toParentDistance = get_scaled_planet_to_sun_dist(REAL_EARTH_TO_SUN_DISTANCE)
        this.radius = get_scaled_planet_size(REAL_EARTH_DIAMETER)
        this.orbitalSpeed = get_scaled_planet_orbital_speed(REAL_EARTH_ORBITAL_SPEED)
        this.rotationalSpeed = get_scaled_planet_rotational_speed(REAL_EARTH_ROTATIONAL_SPEED)

        let x = SUN_X + this.toParentDistance * Math.cos(this.phi)
        let y = SUN_Y + this.toParentDistance * Math.sin(this.phi)
        let z = SUN_Z 

        this.textureLoader = new THREE.TextureLoader();

        let initialPosition = new THREE.Vector3(x, y, z)

        let geometry = new THREE.SphereGeometry(this.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        let material = this.createMaterial();

        let cloudMesh = this.createClouds();
        cloudMesh.layers.enable(BLOOM_LAYER)

        let mesh = new THREE.Mesh(geometry, material);
        mesh.add(cloudMesh);
        mesh.position.copy(initialPosition)
        mesh.rotation.x = Math.PI/2

        this.obj = mesh

        scene.add(this.obj)
    }

    createClouds() {
        const canvasCloud = this.textureLoader.load(
          `${GRAPHICS_PATH}/earth_clouds.png`
        );
      
        const geometry = new THREE.SphereGeometry(this.radius + 0.005, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        const material = new THREE.MeshPhongMaterial({
          map: canvasCloud,
          transparent: true,
          depthTest: true
        });
      
        const cloudMesh = new THREE.Mesh(geometry, material);
      
        return cloudMesh;
    };
      
    createMaterial() {
        const material = new THREE.MeshPhongMaterial();
      
        // earth map
        const earthMap = this.textureLoader.load(
            `${GRAPHICS_PATH}/earth_night.jpg`
        );
        material.map = earthMap;
      
        // bump
        const earthBump = this.textureLoader.load(
            `${GRAPHICS_PATH}/earth_bump.jpg`
        );
        material.bumpMap = earthBump;
        material.bumpScale = 0.005;

        // specular map
        const earthSpecular = this.textureLoader.load(
            `${GRAPHICS_PATH}/earth_specular.png`
        );
        material.specularMap = earthSpecular;
        material.specular = new THREE.Color("black");
      
        return material;
    }

    // updateScale(camera) {
    //     let dist = this.obj.position.distanceTo(camera.position) / 250

    //     // update size
    //     let size = dist * this.radius
    //     size = clamp(size, SUN_MIN, SUN_MAX)
    //     this.obj?.scale.copy(new THREE.Vector3(size, size, size))
    // }

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

        this.obj.children[0].rotation.y += (1/4) * deltaPhi; // clouds
        this.obj.rotation.y += deltaPhi; // main body
    }
}
