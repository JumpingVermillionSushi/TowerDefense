MyGame.GameView = function(model, input,controls){
    //var waveIndicator;
    //initialize waveIndicator
    //add waveIndicator MouseListener

    //initialize buttonGrid
    var mouse = input.Mouse();
    var keyboard = input.Keyboard();

    var buttonGrid = MyGame.uiComponents.CanvasButtonGrid(mouse);


    //initialize each button
    var GroundBomb = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:100}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"black",fill:"red"}),
        mouseEnterDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"aqua"}),
        mouseDownDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"purple"})
    });


    var GroundFreeze = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:200}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"aqua",fill:"blue"}),
        mouseEnterDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"aqua"}),
        mouseDownDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"purple"})
    });

    var MixedProjectile = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:300}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"aqua",fill:"lightgreen"}),
        mouseEnterDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"aqua"}),
        mouseDownDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"purple"})
    });

    var AirMissile = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:400}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"DarkOrange",fill:"yellow"}),
        mouseEnterDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"aqua"}),
        mouseDownDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"purple"})
    });

    var creep = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:700,y:600}, height:100, width:100, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"DarkOrange",fill:"yellow"}),
        mouseEnterDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"aqua"}),
        mouseDownDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"purple"})
    });


    var Upgrade = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:100,y:800}, height:25, width:75, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"black",fill:"Green"}),
        mouseEnterDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"aqua"}),
        mouseDownDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"purple"})
    });

    var Sell = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:200,y:800}, height:25, width:75, rotate:0},
        drawable:MyGame.graphics.RectangleDrawable({stroke:"black",fill:"red"}),
        mouseEnterDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"aqua"}),
        mouseDownDrawable:MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"purple"})
    });


    //for each button register event using model
    GroundBomb.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.GroundBomb);
    }});
    GroundFreeze.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.GroundFreeze);
    }});
    MixedProjectile.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.MixedProjectile);
    }});
    AirMissile.addButtonListener("logStuff", {onClick:function(){
        model.placeButtonPressed(TowerTemplate.AirMissile);
    }});
    creep.addButtonListener("logStuff", {onClick:function(){
        model.toggleCreepGen();
    }});
    Upgrade.addButtonListener("logStuff", {onClick:function(){
        let x=model.enoughCurrency(MyGame.components.costToUpgrade());
        if(x){
            //console.log("hit");
            model.decrementCurrency(MyGame.components.costToUpgrade());
            MyGame.components.upgradeTower();
        }
    }});
    Sell.addButtonListener("logStuff", {onClick:function(){
        model.removeTower();
    }});




    buttonGrid.addButton(GroundBomb);
    buttonGrid.addButton(GroundFreeze);
    buttonGrid.addButton(MixedProjectile);
    buttonGrid.addButton(AirMissile);
    buttonGrid.addButton(creep);
    buttonGrid.addButton(Upgrade);
    buttonGrid.addButton(Sell);

    console.log(controls.getKeyCode("Upgrade"));

    
    if(controls.getKeyCode("Upgrade")!==undefined){
        keyboard.registerKeyUp(controls.getKeyCode("Upgrade"),function(){
            console.log("foobar");
            Upgrade.onMouseClick();
        });
    }
    if(controls.getKeyCode("Level")!==undefined){
        keyboard.registerKeyUp(controls.getKeyCode("Level"),function(){
                        console.log("bar");

            creep.onMouseClick();
        });
    }
    if(controls.getKeyCode("Sell")!==undefined){        
        keyboard.registerKeyUp(MyGame.configurePersitance.getKeyCode("Sell"),function(){
                        console.log("foo");

            Sell.onMouseClick();
        });
    }



    function update(elapsedTime){
        mouse.update(elapsedTime);
        keyboard.update(elapsedTime);
        // buttonGrid.update(update);
        // waveIndicator.update(update);
    }

    function draw(elapsedTime){
        // buttonGrid.render(update);
        buttonGrid.draw();
        // waveIndicator.render(update);
    }

    return {
        update:update,
        draw:draw
    }
}
