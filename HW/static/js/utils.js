import { Vector3 } from "three"
import { ARM_X_DIST, SPIRAL } from "./config/galaxyConfig.js"
import { SCALED_SUN_RADIUS, 
         REAL_SUN_DIAMETER, 
         REAL_MERCURY_TO_SUN_DISTANCE, 
         SCALED_MERCURY_TO_SUN_DISTANCE, 
         SCALED_MERCURY_ORBITAL_SPEED, 
         REAL_MERCURY_ORBITAL_SPEED,
         SCALED_SUN_ROTATIONAL_SPEED,
         REAL_SUN_ROTATIONAL_SPEED } from "./config/solarSystemConfig.js"

export function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random()
    let v = Math.random()
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    return z * stdev + mean
}

export function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value))
}

export function spiral(x, y, z, offset) {
    let r = Math.sqrt(x**2 + y**2);
    let theta = offset
    theta += x > 0 ? Math.atan(y/x) : Math.atan(y/x) + Math.PI
    theta += (r/ARM_X_DIST) * SPIRAL
    return new Vector3(r*Math.cos(theta), r*Math.sin(theta), z)
}

export function degrees_to_radians(degree) {
    return degree * Math.PI / 180;
}

export function get_scaled_planet_size(realSize) {
    return (SCALED_SUN_RADIUS * realSize)/REAL_SUN_DIAMETER
}

export function get_scaled_planet_to_sun_dist(realDist) {
    return (SCALED_MERCURY_TO_SUN_DISTANCE * realDist)/REAL_MERCURY_TO_SUN_DISTANCE
}

export function get_scaled_planet_orbital_speed(realOrbitalSpeed) {
    return (SCALED_MERCURY_ORBITAL_SPEED * realOrbitalSpeed)/REAL_MERCURY_ORBITAL_SPEED
}

export function get_scaled_planet_rotational_speed(realRotationalSpeed) {
    return (SCALED_SUN_ROTATIONAL_SPEED * realRotationalSpeed)/REAL_SUN_ROTATIONAL_SPEED
}
