const all = (iterable,condition) =>{
  for (let i of iterable){
    if (!condition(i)){
      return false
    }
  }
  return true
}

let mouseJustDown = false
let clickedLast = false
function handleMouseJustDown(){
  if (mouseIsPressed){
    if (!clickedLast){
      mouseJustDown=true
    }
    clickedLast=true
  }else{
    clickedLast=false
  }
}

let itemLookup={
  Berry:{
    InventoryIcon:(x,y,w,h)=>{
      fill('red')
      rect(x+20,y+20,w-40,h-40)
    },
    ToolTip:'Berry: a little red berry',
    ControlsLines:['M1: Consume','M2: Discard All'],
    m1clicked:()=>{
      player.consume('Berry',1)
    },
    m2clicked:()=>{
      player.discard('Berry',-1)
    },
    consumeEffect:()=>{
      if (player.stats.hunger.val<=player.stats.hunger.max-12){
        player.stats.hunger.val+=12
      }else{
        player.stats.hunger.val+=(player.stats.hunger.max-player.stats.hunger.val)
      }
    }
  }
}

let player

let tileSize = 40
let gridSize = 20
let gsInPx=tileSize*gridSize

let gridsX={}
let effectProps=[]

function setup(){
  createCanvas(960,720)
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  player = new Player(0,0)
}
let minimapPixels=[]

function drawChunks(){
  strokeWeight(0)
  let ctlbx=((Math.floor(player.camTopLeft.x/gsInPx)*gsInPx)/gsInPx)-1
  let ctlby=((Math.floor(player.camTopLeft.y/gsInPx)*gsInPx)/gsInPx)-1

  let cbrbx=((Math.ceil(player.camBottomRight.x/gsInPx)*gsInPx)/gsInPx)+1
  let cbrby=((Math.ceil(player.camBottomRight.y/gsInPx)*gsInPx)/gsInPx)+1
  let mmp=[]

  for (let x=ctlbx;x<cbrbx;x++){
    let gx
    if (!(x in gridsX)){
      gridsX[x]={}
    }
    gx=gridsX[x]
    for (let y=ctlby;y<cbrby;y++){
      let gy
      if (!(y in gx)){
        gx[y]=[]
        chunkbiome=noise(x,y)
        for (let tx=0;tx<gridSize;tx++){
          for (let ty=0;ty<gridSize;ty++){
            let lx = tx*tileSize
            let ly = ty*tileSize
            let ax = (x*gsInPx)+lx
            let ay = (y*gsInPx)+ly

            let n=noise(1000+ax/250,1000+ay/250)
            let type='error'
            let prop=''

            if (chunkbiome<0.2){
              if (n>0.2){
                type='water'
                if (n>0.45){
                  type='deepwater'
                }
              }else{
                type='grass'
                if (random()>0.99){
                  prop='BerryBush'
                }
              }  
            }else if (chunkbiome<0.4){
              if (n>0.3){
                type='water'
                if (n>0.65){
                  type='deepwater'
                }
              }else{
                type='grass'
                if (random()>0.99){
                  prop='BerryBush'
                }
              }  
            }else{
              if (n>0.5){
                type='water'
                if (n>0.65){
                  type='deepwater'
                }
              }else{
                type='grass'
                if (random()>0.99){
                  prop='BerryBush'
                }
              }  
            }

            let tile = new Tile(ax,ay,type)
            if (prop=='BerryBush'){
              tile.prop=new BerryBush(tile)
            }
            gx[y].push(tile)
          }
        }
      }
      gy=gx[y]
      for (let tile of gy){
        tile.draw(player.camTopLeft)
        if (abs(tile.x-player.x)<=gsInPx && abs(tile.y-player.y)<=gsInPx){
          mmp.push({
            x:(tile.x-player.x)/10,
            y:(tile.y-player.y)/10,
            c:tile.c
          })
        }
      }
    }
  }
  minimapPixels=mmp
}
function drawEffects(){
  for (let p of effectProps){
    p.draw(player.camTopLeft)
  }
}
function drawUI(){
  stroke(0)
  strokeWeight(1)
  let panel={
    x:50,
    y:50,
    w:550,
    h:75
  }
  fill(0,64)
  rect(panel.x,panel.y,panel.w,panel.h)

  for (let i=0;i<9;i++){
    let sx = panel.x+(10+(i*60))
    if (player.inventory.length > i){
      let item=itemLookup[player.inventory[i].name]
      let hovering=false
      if (collidePointRect(mouseX,mouseY,sx,panel.y+10,50,50)){
        fill(255,128)
        hovering=true
      }else{
        fill(255,64)
      }
      
      rect(sx,panel.y+10,50,50)
      item.InventoryIcon(sx,panel.y+10,50,50)
      stroke(0)
      strokeWeight(6)
      textSize(25)
      fill('white')
      text(player.inventory[i].count,sx+35,panel.y+60)

      if(hovering){
        textSize(16)
        fill('white')
        text(item.ToolTip,mouseX+12,mouseY+textAscent())
        ma=0
        for (let line of item.ControlsLines){
          if (textWidth(line)>ma){
            ma=textWidth(line)
          }
        }
        strokeWeight(0)
        fill(255,128)
        rect(mouseX+24,mouseY+textAscent()+5,ma,textAscent()*item.ControlsLines.length+10)
        fill('black')
        text(item.ControlsLines.join('\n'),mouseX+24,mouseY+textAscent()*2+5)
        if (mouseJustDown){
          if (mouseButton==LEFT){
            if ('m1clicked' in item){
              item.m1clicked()
            }
          }else{
            if ('m2clicked' in item){
              item.m2clicked()
            }
          }
        }
      }

    }
  }

  stroke(0)
  strokeWeight(0)
  for (let p of minimapPixels){
    fill(p.c)
    rect(725+p.x,100+p.y,5,5)
  }
  fill('red')
  rect(725,100,5,5)
  strokeWeight(10)
  fill(0,0)
  rect(645,20,160,160)

  let barwidth=250
  let stepY=150
  strokeWeight(2)
  for (let stat in player.stats){
    let s=player.stats[stat]
    if (s.displayed){
      fill(255,128)
      rect(50,stepY,barwidth,30)
      fill(s.color)
      let w=barwidth*(s.val/s.max)
      rect(50,stepY,w,30)
      fill('black')
      textSize(20)
      strokeWeight(1)
      text(stat,60,stepY+textAscent())
      stepY+=40
    }
  }

}

function draw(){
  handleMouseJustDown()
  background(255)
  drawChunks()
  drawEffects()
  player.draw()
  drawUI()

  mouseJustDown=false
}