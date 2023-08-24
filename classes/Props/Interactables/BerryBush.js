class BerryBush extends InteractableRect{
    constructor(parent){
        super(parent,tileSize,tileSize,'darkgreen')
        this.berries=[]
        this.berries.push({x:random(5,30),y:random(5,10)})
        this.berries.push({x:random(5,30),y:random(10,20)})
        if (random()>0.25){
            this.berries.push({x:random(5,30),y:random(20,30)})
            if (random()>0.75){
                this.berries.push({x:random(5,30),y:random(2,35)})
            }
        }
    }   
    draw(camtlpos){
        super.draw(camtlpos)

        strokeWeight(0)
        fill('red')

        for (let berry of this.berries){
            rect(this.gx+berry.x,this.gy+berry.y,10,10)
        }
    }
    mouseClicked(){
        super.mouseClicked()
        if (Math.sqrt((this.x-player.x)**2 + (this.y-player.y)**2)/tileSize <= 3){
            if (this.berries.length>=1){
                if(player.addItem('Berry')){
                    this.berries.splice(0,1)
                }
            }    
        }
    }
}