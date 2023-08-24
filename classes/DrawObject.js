class DrawObject{
    constructor(x,y){
        this.x=x
        this.y=y
    }
    draw(camtlpos){
        let gx = this.x-camtlpos.x-(this.w/2)
        let gy = this.y-camtlpos.y-(this.h/2)
        return [gx,gy]
    }
}