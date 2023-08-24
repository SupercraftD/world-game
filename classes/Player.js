class Player extends DrawRectObject{
    constructor(x,y){
        super(x,y,40,40,'red')
        this.camTopLeft={x:x-(width/2),y:y-(height/2)}
        this.camBottomRight={x:this.camTopLeft.x+width,y:this.camTopLeft.y+height}
        this.speed=5
        this.halfspeed=this.speed/2
        this.quarterspeed=1.5

        this.waterEffectsData={db:false}
        this.inventory=[]
        this.maxInventoryLength = 9

        this.stats={
            'hp':{
                'max':100,
                'val':100,
                'displayed':true,
                'color':'red'
            },
            'oxygen':{
                'max':100,
                'val':100,
                'displayed':false,
                'color':'lightblue'
            }
        }

    }
    draw(){
        strokeWeight(3)
        stroke(0)
        super.draw(this.camTopLeft)
        const colliding=(type)=>{
            for (let t of this.getCollidingTiles()){
                if (t.type==type){
                    return true
                }
            }
            return false
        }

        let dx=0
        let dy=0

        if (keyIsDown('W'.charCodeAt(0)) || keyIsDown(UP_ARROW)){
            dy-=1
        }
        if (keyIsDown('S'.charCodeAt(0)) || keyIsDown(DOWN_ARROW)){
            dy+=1
        }
        if (keyIsDown('A'.charCodeAt(0)) || keyIsDown(LEFT_ARROW)){
            dx-=1
        }
        if (keyIsDown('D'.charCodeAt(0)) || keyIsDown(RIGHT_ARROW)){
            dx+=1
        }

        if (colliding('deepwater')){
            dy *= this.quarterspeed
            dx *= this.quarterspeed
            this.stats.oxygen.displayed=true
            this.stats.oxygen.val-=1
            if (this.stats.oxygen.val<0){
                this.stats.oxygen.val=0
                this.stats.hp.val-=0.5
            }
        }else{
            this.stats.oxygen.val+=2
            if (this.stats.oxygen.val>this.stats.oxygen.max){
                this.stats.oxygen.displayed=false
                this.stats.oxygen.val=this.stats.oxygen.max
            }
            if (colliding('water')){
                dy *= this.halfspeed
                dx *= this.halfspeed
            }else{
                dx *= this.speed
                dy *= this.speed
            }
        }

        this.x+=dx        
        this.y+=dy

        let moving=false
        if (dx!=0 || dy!=0){
            moving=true
        }

        if (all(this.getCollidingTiles(),(e)=>{return e.type=='water' || e.type=='deepwater'}) && !this.waterEffectsData.db && moving){
            effectProps.push(new WaterRipple(this.x,this.y))
            this.waterEffectsData.db=true
            this.waterEffectsData.timer = setTimeout(() => {
                this.waterEffectsData.db=false
            }, 250);
        }

        this.camTopLeft={x:this.x-(width/2),y:this.y-(height/2)}
        this.camBottomRight={x:this.camTopLeft.x+width,y:this.camTopLeft.y+height}

    }
    getCollidingTiles(){
        let ctiles=[]

        let ctlbx=((Math.floor(this.camTopLeft.x/gsInPx)*gsInPx)/gsInPx)
        let ctlby=((Math.floor(this.camTopLeft.y/gsInPx)*gsInPx)/gsInPx)
      
        let cbrbx=((Math.ceil(this.camBottomRight.x/gsInPx)*gsInPx)/gsInPx)
        let cbrby=((Math.ceil(this.camBottomRight.y/gsInPx)*gsInPx)/gsInPx)
        for (let x=ctlbx;x<cbrbx;x++){
            let gx
            gx=gridsX[x]
            for (let y=ctlby;y<cbrby;y++){
                let gy
                gy=gx[y]
                for (let tile of gy){
                    if (collideRectRect(this.x+1,this.y+1,this.w-2,this.h-2,tile.x,tile.y,tile.w,tile.h)){
                        ctiles.push(tile)
                    }
                }
            }
        }
        return ctiles        
    }
    addItem(itemname){
        if (this.inventory.length<this.maxInventoryLength){
            let bItem=null
            for (let t of this.inventory){
                if (t.name==itemname){
                    bItem=t
                }
            }
            if (bItem!=null){
                bItem.count +=1
            }else{
                player.inventory.push({
                    name:itemname,
                    count:1
                })
            }
            return true
        }
        return false
    }
}