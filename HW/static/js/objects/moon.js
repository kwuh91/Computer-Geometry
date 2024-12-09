// import * as THREE from 'three'

// import { REAL_MOON_DIAMETER, MOON_TO_EARTH_DIST, MOON_ROTATION_SPEED } from '../config/solarSystemConfig.js'
// import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS } from '../config/renderConfig.js'
// import { clamp, degrees_to_radians, get_scaled_planet_size } from '../utils.js'

// const GRAPHICS_PATH = '../../graphics/moon'
// const textureLoader = new THREE.TextureLoader();

// export class Moon {

//     constructor(scene, earthInstance) {
//         this.earthInstance = earthInstance
        
//         this.phi = 0
        
//         let x = this.earthInstance.obj.position.x + MOON_TO_EARTH_DIST * Math.cos(this.phi) 
//         let y = this.earthInstance.obj.position.y + MOON_TO_EARTH_DIST * Math.sin(this.phi)
//         let z = this.earthInstance.obj.position.z + 0

//         let initialPosition = new THREE.Vector3(x, y, z)

//         this.radius = get_scaled_planet_size(REAL_MOON_DIAMETER)

//         let geometry = new THREE.SphereGeometry(this.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
//         let texture = textureLoader.load(`${GRAPHICS_PATH}/moon.jpg`)
//         let material = new THREE.MeshStandardMaterial({map: texture})

//         let mesh = new THREE.Mesh(geometry, material);
//         mesh.position.copy(initialPosition)
//         mesh.rotation.x = Math.PI/2

//         this.obj = mesh

//         scene.add(this.obj)
//     }

//     // updateScale(camera) {
//     //     let dist = this.obj.position.distanceTo(camera.position) / 250

//     //     // update size
//     //     let size = dist * this.radius
//     //     size = clamp(size, SUN_MIN, SUN_MAX)
//     //     this.obj?.scale.copy(new THREE.Vector3(size, size, size))
//     // }

//     rotate() { 
//         let radian_phi = degrees_to_radians(MOON_ROTATION_SPEED);

//         // rotating around the earth
//         this.phi = this.phi + radian_phi;

//         let x = this.earthInstance.obj.position.x + MOON_TO_EARTH_DIST * Math.cos(this.phi) 
//         let y = this.earthInstance.obj.position.y + MOON_TO_EARTH_DIST * Math.sin(this.phi)
//         let z = this.earthInstance.obj.position.z + 0

//         let newPosition = new THREE.Vector3(x, y, z)

//         this.obj?.position.copy(newPosition);

//         // rotating around itself
//         this.obj.rotation.z += radian_phi;
//     }
// }
