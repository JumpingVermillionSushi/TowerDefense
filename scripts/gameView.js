MyGame.GameView = function(model, keyboard, mouse){
    //var waveIndicator;
    //initialize waveIndicator
    //add waveIndicator MouseListener

    //initialize buttonGrid
    var buttonGrid = MyGame.uiComponents.CanvasButtonGrid(mouse);


    //initialize each button
    var theButton = MyGame.uiComponents.CanvasButton({
        dims:{center:{x:300,y:300}, height:100, width:100, rotate:0}},
        drawable:{MyGame.graphics.RectangleDrawable({stroke:"blue",fill:"yellow"})}
    });

    //for each button register event using model
    theButton.addButtonListener("logStuff", {onclick:function(evt){
        console.log("the button has been clicked")
    }});
    buttonGrid.addButton(theButton);


    function update(elapsedTime){
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
