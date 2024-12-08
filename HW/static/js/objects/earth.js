import * as THREE from 'three'

import { SUN_X, SUN_Y, SUN_Z, EARTH_RADIUS, EARTH_TO_SUN_DIST, EARTH_ROTATION_SPEED } from '../config/solarSystemConfig.js'
import { BLOOM_LAYER, SUN_MAX, SUN_MIN, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS } from '../config/renderConfig.js'
import { clamp, degrees_to_radians } from '../utils.js'

const GRAPHICS_PATH = '../../graphics/earth'

export class Earth {

    constructor(scene) {
        this.phi = 0
        
        let x = EARTH_TO_SUN_DIST * Math.cos(this.phi)
        let y = EARTH_TO_SUN_DIST * Math.sin(this.phi)
        let z = SUN_Z

        this.textureLoader = new THREE.TextureLoader();

        this.position = new THREE.Vector3(x, y, z)

        let geometry = new THREE.SphereGeometry(EARTH_RADIUS, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        let material = this.createMaterial();

        let cloudMesh = this.createClouds();
        cloudMesh.layers.enable(BLOOM_LAYER)

        let mesh = new THREE.Mesh(geometry, material);
        mesh.add(cloudMesh);
        mesh.position.copy(this.position)
        mesh.rotation.x = Math.PI/2

        this.obj = mesh

        scene.add(this.obj)
    }

    createClouds() {
        const canvasCloud = this.textureLoader.load(
          `${GRAPHICS_PATH}/earth_clouds.png`
        );
      
        const geometry = new THREE.SphereGeometry(EARTH_RADIUS + 0.005, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS);
        const material = new THREE.MeshPhongMaterial({
          map: canvasCloud,
          transparent: true,
          depthTest: false,
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

    updateScale(camera) {
        let dist = this.position.distanceTo(camera.position) / 250

        // update earth size
        let earthSize = dist * EARTH_RADIUS
        earthSize = clamp(earthSize, SUN_MIN, SUN_MAX)
        this.obj?.scale.copy(new THREE.Vector3(earthSize, earthSize, earthSize))
    }

    rotate() { 
        // rotating around the sun
        this.phi = this.phi + degrees_to_radians(EARTH_ROTATION_SPEED);

        let x = EARTH_TO_SUN_DIST * Math.cos(this.phi) + SUN_X
        let y = EARTH_TO_SUN_DIST * Math.sin(this.phi) + SUN_Y
        let z = 0 + SUN_Z

        let newPosition = new THREE.Vector3(x, y, z)

        this.obj?.position.copy(newPosition);

        // rotating around itself
        // this.obj.children[0].rotation.y += (1/16) * EARTH_ROTATION_SPEED;
        // this.obj.rotation.y += (1/20) * EARTH_ROTATION_SPEED;

        this.obj.children[0].rotation.z += (1/16) * EARTH_ROTATION_SPEED;
        this.obj.rotation.z += (1/20) * EARTH_ROTATION_SPEED;
    }
}
