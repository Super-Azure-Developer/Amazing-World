import Registry from '@/Registry.js' 

import { vec3, quat2 } from 'gl-matrix'

class PlayerView
{
    constructor(player)
    {
        this.game = new Registry.Game()
        this.engine = new Registry.Engine.Engine()
        this.controls = this.engine.controls
        this.debug = this.game.debug

        this.player = player

        this.position = vec3.create()
        this.quaternion = quat2.create()
        this.mode = PlayerView.MODE_THIRDPERSON

        this.thirdPerson = new Registry.Engine.PlayerViewThirdPerson(this.player)
        this.fly = new Registry.Engine.PlayerViewFly(this.player)
        
        // Activate
        if(this.mode === PlayerView.MODE_THIRDPERSON)
            this.thirdPerson.activate()
        
        else if(this.mode === PlayerView.MODE_FLY)
            this.fly.activate()

        this.controls.on('viewModeDown', () =>
        {
            if(this.mode === PlayerView.MODE_THIRDPERSON)
            {
                this.mode = PlayerView.MODE_FLY
                this.fly.activate(this.position, this.quaternion)
                this.thirdPerson.deactivate()
            }
            
            else if(this.mode === PlayerView.MODE_FLY)
            {
                this.mode = PlayerView.MODE_THIRDPERSON
                this.fly.deactivate()
                this.thirdPerson.activate()
            }
        })

        this.setDebug()
    }

    update()
    {
        this.thirdPerson.update()
        this.fly.update()

        if(this.mode === PlayerView.MODE_THIRDPERSON)
        {
            vec3.copy(this.position, this.thirdPerson.position)
            quat2.copy(this.quaternion, this.thirdPerson.quaternion)
        }

        else if(this.mode === PlayerView.MODE_FLY)
        {
            vec3.copy(this.position, this.fly.position)
            quat2.copy(this.quaternion, this.fly.quaternion)
        }
    }

    setDebug()
    {
        const debug = this.game.debug

        if(!debug.active)
            return

        const folder = debug.ui.getFolder('engine/player/view')

        folder
            .add(
                this,
                'mode',
                {
                    'MODE_THIRDPERSON': PlayerView.MODE_THIRDPERSON,
                    'MODE_FLY': PlayerView.MODE_FLY
                }
            )
            .onChange(() =>
            {
                if(this.mode === PlayerView.MODE_THIRDPERSON)
                {
                    this.fly.deactivate()
                    this.thirdPerson.activate()
                }
                
                else if(this.mode === PlayerView.MODE_FLY)
                {
                    this.fly.activate(this.position, this.quaternion)
                    this.thirdPerson.deactivate()
                }
            })
    }
}

PlayerView.MODE_THIRDPERSON = 1
PlayerView.MODE_FLY = 2

Registry.register('Engine', 'PlayerView', PlayerView)
export default PlayerView