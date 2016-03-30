/*
This File holds the structures used to emulate
the game play, such as enimies, towers

Concept We have the toer class as outside of the compents

Compents Is then composed of towers, and handles calling render on each of them
Wepons, parts of towers, generate bullets, which componets then handles and manages


*/
function Tower(spec){
    this.center=spec.center;
    this.weapon=spec.weapon;
    this.image=spec.image;
    this.rotation=0;
    this.height=spec.height;
    this.width=spec.width;
}
//tower funtions go here
Tower.prototype={
    shoot:function(){
        
    },
    draw:function(drawRange){
        if(drawRange==='undefined'){
            //Draw a circle for range.
        }
        image.draw();
        weapon.draw();//draw the weapon on top the turret
    }
}

function Weapon(spec){
    this.center=spec.center;
    this.weapon=spec.weapon;
    this.image=spec.image;
    this.rotation=0;
    this.height=spec.height;
    this.width=spec.width;
    this.range=spec.range;

}
//Weapon funtions go here

Weapon.prototype={
    shoot:function(){

    },
    draw:function(){
        image.draw();
    }
}



MyGame.components=(function(graphics){
    var that={};

    that.towerArray=[];

    that.addTower=function(spec){
        that.towerArray.push(new Tower(spec));
    };

    that.arena={
        center:{x:400,y:400},
        width:400,
        height:400,
        subGrid:10,
		fill : 'rgba(0, 150, 250, 1)',
		stroke : 'rgba(255, 0, 0, 1)',
        draw:function(drawGrid){
            if(drawGrid==='undefined'){
                //Draw the lines for the grid
            }
            graphics.drawRectangle(this);
            //draw four rectangles for the opening
        },
    };


    that.renderTowers=function(elapsed){
        for(var i=0;i<toers.length;i++){
            that.towerArray[i].draw();
        }
    };

    /*
    function designed to render every part of componets
    rather user picking
    */
    that.renderAll=function(elapsed){
        that.renderTowers(elapsed);
        that.arena(false);
    };

    //may want an update in future


    return that;
}(MyGame.graphics));
