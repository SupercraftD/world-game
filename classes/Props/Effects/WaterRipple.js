class WaterRipple extends DrawObject{
    constructor(x,y){
        super(x,y)
        this.d=0
        this.w=this.d
        this.h=this.d
    }
    draw(camtlpos){
        let [gx,gy]=super.draw(camtlpos)
        stroke('lightblue')
        strokeWeight(5)
        fill(0,0)
        circle(gx,gy,this.d)
        this.d+=1
        this.x+=0.5
        this.y+=0.5
        this.w=this.d
        this.h=this.d
        if (this.d>tileSize){
            effectProps.splice(effectProps.indexOf(this),1)
        }
    }
}