import GAME from '@/Game.js' 

import * as THREE from 'three'

class Terrains
{
    constructor()
    {
        this.world = new GAME.World()
        this.state = new GAME.ENGINE.Engine()
        this.view = new GAME.VIEW.View()
        this.viewport = this.world.viewport
        this.sky =  this.view.sky

        this.setGradient()
        this.setMaterial()
        this.setDebug()

        this.state.terrains.on('create', (terrainEngine) =>
        {
            const terrain = new GAME.VIEW.Terrain(this, terrainEngine)

            terrainEngine.on('destroy', () =>
            {
                terrain.destroy()
            })
        })
    }

    setGradient()
    {
        this.gradient = new GAME.VIEW.TerrainGradient()
    }

    setMaterial()
    {
        this.material = new GAME.VIEW.MATERIALS.Terrain()
        this.material.uniforms.uPlayerPosition.value = new THREE.Vector3()
        this.material.uniforms.uGradientTexture.value = this.gradient.texture
        this.material.uniforms.uLightnessSmoothness.value = 0.25
        this.material.uniforms.uFresnelOffset.value = 0
        this.material.uniforms.uFresnelScale.value = 0.5
        this.material.uniforms.uFresnelPower.value = 2
        this.material.uniforms.uSunPosition.value = new THREE.Vector3(- 0.5, - 0.5, - 0.5)
        this.material.uniforms.uFogTexture.value = this.sky.customRender.texture
        this.material.uniforms.uGrassDistance.value = this.state.chunks.minSize

        this.material.onBeforeRender = (renderer, scene, camera, geometry, mesh) =>
        {
            this.material.uniforms.uTexture.value = mesh.userData.texture
            this.material.uniformsNeedUpdate = true
        }

        // this.material.wireframe = true

        // const dummy = new THREE.Mesh(
        //     new THREE.SphereGeometry(30, 64, 32),
        //     this.material
        // )
        // dummy.position.y = 50
        // this.scene.add(dummy)
    }

    setDebug()
    {
        const debug = this.world.debug

        if(!debug.active)
            return

        const folder = debug.ui.getFolder('render/terrains')

        folder
            .add(this.material, 'wireframe')

        folder
            .add(this.material.uniforms.uLightnessSmoothness, 'value')
            .min(0)
            .max(1)
            .step(0.001)
            .name('uLightnessSmoothness')
        
        folder
            .add(this.material.uniforms.uFresnelOffset, 'value')
            .min(- 1)
            .max(1)
            .step(0.001)
            .name('uFresnelOffset')
        
        folder
            .add(this.material.uniforms.uFresnelScale, 'value')
            .min(0)
            .max(2)
            .step(0.001)
            .name('uFresnelScale')
        
        folder
            .add(this.material.uniforms.uFresnelPower, 'value')
            .min(1)
            .max(10)
            .step(1)
            .name('uFresnelPower')
    }

    update()
    {
        const playerEngine = this.state.player
        const playerPosition = playerEngine.position.current
        const sunEngine = this.state.sun

        this.material.uniforms.uPlayerPosition.value.set(playerPosition[0], playerPosition[1], playerPosition[2])
        this.material.uniforms.uSunPosition.value.set(sunEngine.position.x, sunEngine.position.y, sunEngine.position.z)
    }

    resize()
    {
    }
}

GAME.register('VIEW', 'Terrains', Terrains)
export default Terrains