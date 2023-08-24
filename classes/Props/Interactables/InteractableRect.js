class InteractableRect extends DrawRectObject{
    constructor(parent,w,h,c){
        super(parent.x,parent.y,w,h,c)
    }
    draw(camtlpos){
        strokeWeight(1)
        stroke('gray')
        let gx=this.x-camtlpos.x-(this.w/2)
        let gy=this.y-camtlpos.y-(this.h/2)
        if (collidePointRect(mouseX,mouseY,gx,gy,this.w,this.h)){
            this.mouseHover()
            if (mouseIsPressed){
                this.mousePressed()
                if (mouseJustDown){
                    this.mouseClicked()
                }
            }
        }
        super.draw(camtlpos)
    }
    mouseHover(){
        strokeWeight(3)
    }
    mousePressed(){
        stroke('black')
    }
    mouseClicked(){
        
    }
}