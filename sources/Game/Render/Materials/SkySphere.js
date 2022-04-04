import GAME from '@/Game.js' 

import * as THREE from 'three'

import vertexShader from './shaders/skySphere/vertex.glsl'
import fragmentShader from './shaders/skySphere/fragment.glsl'

function SkySphere()
{
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            uSunPosition: { value: new THREE.Vector3() },
            uAtmosphereElevation: { value: 0.5 },
            uAtmospherePower: { value: 10 },
            uColorDayLow: { value: new THREE.Color() },
            uColorDayHigh: { value: new THREE.Color() },
            uColorNightLow: { value: new THREE.Color() },
            uColorNightHigh: { value: new THREE.Color() },
            uDawnAngleAmplitude: { value: 1 },
            uDawnElevationAmplitude: { value: 0.2 },
            uColorDawn: { value: new THREE.Color() },
            uSunAmplitude: { value: 0.75 },
            uSunMultiplier: { value: 1 },
            uColorSun: { value: new THREE.Color() },
            uDayProgress: { value: 0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}

GAME.register('RENDER.MATERIALS', 'SkySphere', SkySphere)
export default SkySphere