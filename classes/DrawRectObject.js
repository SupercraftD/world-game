class DrawRectObject extends DrawObject{
    constructor(x,y,w,h,c){
        super(x,y)
        this.w=w
        this.h=h
        this.c=c
    }
    draw(camtlpos){
        let [gx,gy]=super.draw(camtlpos)
        this.gx=gx
        this.gy=gy
        fill(this.c)
        rect(gx,gy,this.w,this.h)
    }
}