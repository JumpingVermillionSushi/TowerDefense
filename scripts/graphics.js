MyGame.graphics=(function(){

    var canvas=document.getElementById('GameWindow');
    var context=canvas.getContext('2d');


    function clear(){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        fillBackground();
    }
    function writeMessage(input){
        context.textAlign="center";
        context.fillText(input, canvas.width/2, canvas.height/2);

    }
    //may want to rewrite
    function writeSpecificMessage(input,x,y){
        context.textAlign="center";
         context.font="30px Arial";
        context.fillText(input, x,y);
    }
    function fillBackground(color){
        if(color===undefined)
            color='#FFFFFF'
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle=color;
		context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

    }
    function drawImage(dims){
        context.save();

		context.translate(dims.center.x, dims.center.y);
		context.rotate(dims.rotation);
		context.translate(-dims.center.x, -dims.center.y);

		context.drawImage(
			dims.image,
			dims.center.x - dims.width/2,
			dims.center.y - dims.height/2,
			dims.width, dims.height);

		context.restore();
    }

    function scaleGameboard(x,y){
        context.save();
        context.scale(canvas.width/y,canvas.height/x);
    }

    function unscaleGameBoard(){
        context.restore();
    }

    function GenericImage(){


    }

    /*
    Expects an onbject of with top right x, top right y,
    width, hieght, rotation
    fill ="rgba(r,g,b,a)"\storke style, is the stroke of the outer areana
    */
    function drawRectangle(dims){
        context.save();
        context.translate(dims.center.x , dims.center.y);
        context.rotate(dims.rotation);
        context.translate(-(dims.center.x), -(dims.center.y));

        context.fillStyle = dims.fill;
        context.fillRect(dims.center.x-dims.width/2, dims.center.y-dims.height/2, dims.width, dims.height);

        context.strokeStyle = dims.stroke;
        context.strokeRect(dims.center.x-dims.width/2, dims.center.y-dims.height/2, dims.width, dims.height);

        context.restore();
    };

    /*
    takes,
    */
    function SpriteSheet(spriteinfo){
        var that={};
        var ready=false;
        var image=new Image();
        var timeElapsed=0;
        image.onload = function(){
           that.draw = function (){
                context.save();

				context.translate(spriteinfo.center.x, spriteinfo.center.y);
				context.rotate(spriteinfo.rotation);
				context.translate(-spriteinfo.center.x, -spriteinfo.center.y);

                context.drawImage(
                    image,
                    spriteinfo.width * sprite, 0,	// Which sprite to pick out
                    spriteinfo.width, spriteinfo.height,		// The size of the sprite
                    spriteinfo.center.x - spriteinfo.width/2,	// Where to draw the sprite
                    spriteinfo.center.y - spriteinfo.height/2,
                    spriteinfo.width, spriteinfo.height
                );
                context.restore();

            }
        }
        image.src=spriteinfo.src;
        that.draw= function(){

        };

        that.update = function(elapsedTime, forward) {
			timeElapsed += elapsedTime;
			if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
				//
				// When switching sprites, keep the leftover time because
				// it needs to be accounted for the next sprite animation frame.
				timeElapsed -= spec.spriteTime[spec.sprite];
				//
				// Depending upon the direction of the animation...
				if (forward === true) {
					spec.sprite += 1;
					//
					// This provides wrap around from the last back to the first sprite
					spec.sprite = spec.sprite % spec.spriteCount;
				} else {
					spec.sprite -= 1;
					//
					// This provides wrap around from the first to the last sprite
					if (spec.sprite <= 0) {
						spec.sprite = spec.spriteCount - 1;
					}
				}
			}
		};

        


        return that;
    }

    return {
        scaleGameboard:scaleGameboard,
        unscaleGameBoard:unscaleGameBoard,
        clear:clear,
        GenericImage:GenericImage,
        SpriteSheet:SpriteSheet,
        drawImage:drawImage,
        writeMessage:writeMessage,
        writeSpecificMessage:writeSpecificMessage,
        drawRectangle:drawRectangle,
        canvas:canvas
    };

}());
