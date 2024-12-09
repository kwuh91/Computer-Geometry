// import * as THREE from 'three'

// import { SUN_X, SUN_Y, SUN_Z, EARTH_TO_SUN_DIST, EARTH_ROTATION_SPEED, REAL_MERCURY_DIAMETER, SCALED_MERCURY_TO_SUN_DISTANCE } from '../config/solarSystemConfig.js'
// import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS } from '../config/renderConfig.js'
// import { clamp, degrees_to_radians, get_scaled_planet_size } from '../utils.js'

// const GRAPHICS_PATH = '../../graphics/mercury'

// export class Mercury {

//     constructor(scene) {
//         this.phi = 0
        
//         let x = SCALED_MERCURY_TO_SUN_DISTANCE * Math.cos(this.phi) + SUN_X
//         let y = SCALED_MERCURY_TO_SUN_DISTANCE * Math.sin(this.phi) + SUN_Y
//         let z = 0 + SUN_Z

//         this.textureLoader = new THREE.TextureLoader();

//         let initialPosition = new THREE.Vector3(x, y, z)

//         this.radius = get_scaled_planet_size(REAL_MERCURY_DIAMETER)

//         let geometry = new THREE.SphereGeometry(this.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
//         let texture = textureLoader.load(`${GRAPHICS_PATH}/mercury.jpg`)
//         let material = new THREE.MeshStandardMaterial({map: texture})

//         let mesh = new THREE.Mesh(geometry, material);
//         mesh.position.copy(initialPosition)
//         mesh.rotation.x = Math.PI/2

//         this.obj = mesh

//         scene.add(this.obj)
//     }

//     rotate() { 
//         // rotating around the sun
//         this.phi = this.phi + degrees_to_radians(EARTH_ROTATION_SPEED);

//         let x = EARTH_TO_SUN_DIST * Math.cos(this.phi) + SUN_X
//         let y = EARTH_TO_SUN_DIST * Math.sin(this.phi) + SUN_Y
//         let z = 0 + SUN_Z

//         let newPosition = new THREE.Vector3(x, y, z)

//         // console.log(`new earth position: x: ${newPosition.x}; y: ${newPosition.y}; z: ${newPosition.z}`)

//         this.obj?.position.copy(newPosition);

//         // console.log(`new earth position: x: ${this.obj?.position.x}; y: ${this.obj?.position.y}; z: ${this.obj?.position.z}`)

//         // rotating around itself
//         // this.obj.children[0].rotation.y += (1/16) * EARTH_ROTATION_SPEED;
//         // this.obj.rotation.y += (1/20) * EARTH_ROTATION_SPEED;

//         this.obj.children[0].rotation.z += (1/16) * EARTH_ROTATION_SPEED;
//         this.obj.rotation.z += (1/20) * EARTH_ROTATION_SPEED;
//     }
// }
