class Tile extends DrawRectObject{
    constructor(x,y,type){
        let c='purple'
        if (type=='error'){
            c='purple'
        }else if (type=='grass'){
            c='green'
        }else if (type=='water'){
            c='blue'
        }else if (type=='deepwater'){
            c='darkblue'
        }
        super(x,y,tileSize,tileSize,c)
        this.type=type
        this.prop=-1
    }
    draw(camtlpos){
        strokeWeight(0)
        super.draw(camtlpos)
        if (this.prop!=-1){
            this.prop.draw(camtlpos)
        }
    }
}