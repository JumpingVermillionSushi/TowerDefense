

/*example of use
        keyboard.registerCommand(KeyEvent.DOM_VK_LEFT,function(elapsed){gameObjects.paddle.moveLeft(elapsed);});
*/

MyGame.input=(function(canvas){
    var Keyboard=function (){
        var that={
            keys :[], //key event
            handlers:[],
            keyUpHandler:[],
            upKeys:[] //key event
        };

        function keydown(e){
            that.keys.push({
                key:e.keyCode,
                alt:e.altKey,
                ctrl:e.ctrlKey,
                shift:e.shiftKey
                
            });
        }
        function keyup(e){
            that.upKeys.push({
                key:e.keyCode,
                alt:e.altKey,
                ctrl:e.ctrlKey,
                shift:e.shiftKey
                
            });
            delete that.keys[e.keyCode];
        }

        that.registerCommand=function(key,handler){
            that.handlers.push({key:key,handler:handler});
        }

        that.registerKeyUp=function(key,handler){
            that.keyUpHandler.push({key:key,handler:handler});
        }
        
        
        function keyEventsMatch(k1,k2){
            if(k1.key===k2.key&&k1.alt===k2.alt&&k1.shift===k2.shift&&k1.ctrl===k2.ctrl){
                return true;
            }
            return false;
        }

        that.update=function(elapsed){
            for(var handlerNum=0;handlerNum < that.handlers.length;++handlerNum){
                //console.log(handlerNum);
                for(var j=0;j<that.keys.length;j++){
                    if(keyEventsMatch(that.keys[j],that.handlers[handlerNum].key)){
                        that.handlers[handlerNum].handler(elapsed);
                        break;
                    }
                }
            }
            var toRemove=[];
            for(var handlerNum=0;handlerNum <that.keyUpHandler.length;++handlerNum){
                //console.log(handlerNum);
                var x=that.keyUpHandler[handlerNum];

                for(var j=0;j<that.upKeys.length;j++){
                    var y=that.upKeys[j];
                    toRemove.push(j);

                    if(keyEventsMatch(y,x.key)){
                        that.keyUpHandler[handlerNum].handler(elapsed);
                        break;
                    }
                }
            }
            toRemove.sort(function(a,b){return a-b});
            var seen={};
            for(var i=0;i <toRemove.length;++i){
                if(seen[toRemove[i]]===undefined){
                    seen[toRemove[i]]=true;
                    that.upKeys.splice(toRemove[i],1);
                }
            }
            seen={};
        };

        window.addEventListener('keydown',keydown);
        window.addEventListener('keyup',keyup);

        return that;
    }

    var Mouse=function (){
        var that={
            clicks:[],
            mouseDowns:[],
            mouseUps:[],
            mouseMove:[],
            clickHandlers:[],
            mouseDownHandlers:[],
            mouseUpHandlers:[],
            moveHandlers:[],
        };


        function getMousePos(evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        function click(evt){
            that.clicks.push(evt);
        }
        function mousedown(evt){
            that.mouseDowns.push(evt);
        }
        function mouseup(evt){
            that.mouseUps.push(evt);
        }
        function move(evt){
            that.mouseMove.push(evt);
        }
        //accepts a rectangle that can be rotated, according to boundingRect.rotate
        //center, height,width,rotation
        //theoratically, no matter what happens to the rectangle, it should stay here in the queue;
        that.registerClickCommand=function(handler,boundingRect){
            that.clickHandlers.push({handler:handler,rect:boundingRect});
        }
        that.registerMouseUpCommand=function(handler,boundingRect){
            that.mouseUpHandlers.push({handler:handler,rect:boundingRect});
        }
        that.registerMouseDownCommand=function(handler,boundingRect){
            that.mouseDownHandlers.push({handler:handler,rect:boundingRect});
        }
        that.registerMoveCommand=function(handler,boundingRect,onEnter,onExit){
            if(onExit===undefined){
                onExit=function(){};
            }
            if(onEnter===undefined){
                onEnter=function(){};
            }
            that.moveHandlers.push({handler:handler,rect:boundingRect,enter:onEnter,exit:onExit,lastupdate:2});
        }



        function removeUnwanted(toRemove,fromA){
            toRemove.sort(function(a,b){return b-a;});//garuntee sorted, reverse should work as well
            for(var i=0;i<toRemove.length;i++){
                fromA.splice(toRemove[i],1);
            }
        }

        that.update=function(elapsed){
            toRemove=[];
            for(var i=0;i<that.clicks.length;i++){
                for(var handlerNum=0;handlerNum < that.clickHandlers.length;++handlerNum){
                    if(Collision.pointRect(getMousePos(that.clicks[i]),that.clickHandlers[handlerNum].rect)){
                        that.clickHandlers[handlerNum].handler(getMousePos(that.clicks[i]));
/*                         if(!(toRemove.indexOf(i) > -1)){
                            toRemove.push(i);
                        } */
                    }
                }
            }
            for(var i=0;i<that.mouseDowns.length;i++){
                for(var handlerNum=0;handlerNum < that.mouseDownHandlers.length;++handlerNum){
                    if(Collision.pointRect(getMousePos(that.mouseDowns[i]),that.mouseDownHandlers[handlerNum].rect)){
                        that.mouseDownHandlers[handlerNum].handler(getMousePos(that.mouseDowns[i]));
            /*                         if(!(toRemove.indexOf(i) > -1)){
                            toRemove.push(i);
                        } */
                    }
                }
            }
            for(var i=0;i<that.mouseUps.length;i++){
                for(var handlerNum=0;handlerNum < that.mouseUpHandlers.length;++handlerNum){
                    if(Collision.pointRect(getMousePos(that.mouseUps[i]),that.mouseUpHandlers[handlerNum].rect)){
                        that.mouseUpHandlers[handlerNum].handler(getMousePos(that.mouseUps[i]));
/*                         if(!(toRemove.indexOf(i) > -1)){
                            toRemove.push(i);
                        } */
                    }
                }
            }

            for(var i=that.mouseMove.length-1;i<that.mouseMove.length&&i>0;i++){
                for(var handlerNum=0;handlerNum < that.moveHandlers.length;++handlerNum){
                    if(Collision.pointRect(getMousePos(that.mouseMove[i]),that.moveHandlers[handlerNum].rect)){
                        if(that.moveHandlers[handlerNum].lastupdate===0){
                            that.moveHandlers[handlerNum].enter();
                        }
                        that.moveHandlers[handlerNum].handler(getMousePos(that.mouseMove[i]));
/*                         if(!(toRemove.indexOf(i) > -1)){
                            toRemove.push(i);
                        } */
                        that.moveHandlers[handlerNum].lastupdate=1;
                    }else{
                        if(that.moveHandlers[handlerNum].lastupdate===1){
                            that.moveHandlers[handlerNum].exit();
                        }
                        that.moveHandlers[handlerNum].lastupdate=0;
                    }
                }
            }

            that.clicks=[];
            that.mouseUps=[];
            that.mouseDowns=[];
            that.mouseMove=[];
        };
        canvas.addEventListener('click',click);
        canvas.addEventListener('mousedown',mousedown);
        canvas.addEventListener('mouseup',mouseup);
        canvas.addEventListener('mousemove',move)
        return that;
    }



    return{
        Keyboard:Keyboard,
        Mouse:Mouse
    };

}(MyGame.graphics.canvas));



//------------------------------------------------------------------
//
// Source: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants
// Also from Example Code
//------------------------------------------------------------------
if (typeof KeyEvent === 'undefined') {
	var KeyEvent = {
		DOM_VK_CANCEL: 3,
		DOM_VK_HELP: 6,
		DOM_VK_BACK_SPACE: 8,
		DOM_VK_TAB: 9,
		DOM_VK_CLEAR: 12,
		DOM_VK_RETURN: 13,
		DOM_VK_ENTER: 14,
		DOM_VK_SHIFT: 16,
		DOM_VK_CONTROL: 17,
		DOM_VK_ALT: 18,
		DOM_VK_PAUSE: 19,
		DOM_VK_CAPS_LOCK: 20,
		DOM_VK_ESCAPE: 27,
		DOM_VK_SPACE: 32,
		DOM_VK_PAGE_UP: 33,
		DOM_VK_PAGE_DOWN: 34,
		DOM_VK_END: 35,
		DOM_VK_HOME: 36,
		DOM_VK_LEFT: 37,
		DOM_VK_UP: 38,
		DOM_VK_RIGHT: 39,
		DOM_VK_DOWN: 40,
		DOM_VK_PRINTSCREEN: 44,
		DOM_VK_INSERT: 45,
		DOM_VK_DELETE: 46,
		DOM_VK_0: 48,
		DOM_VK_1: 49,
		DOM_VK_2: 50,
		DOM_VK_3: 51,
		DOM_VK_4: 52,
		DOM_VK_5: 53,
		DOM_VK_6: 54,
		DOM_VK_7: 55,
		DOM_VK_8: 56,
		DOM_VK_9: 57,
		DOM_VK_SEMICOLON: 59,
		DOM_VK_EQUALS: 61,
		DOM_VK_A: 65,
		DOM_VK_B: 66,
		DOM_VK_C: 67,
		DOM_VK_D: 68,
		DOM_VK_E: 69,
		DOM_VK_F: 70,
		DOM_VK_G: 71,
		DOM_VK_H: 72,
		DOM_VK_I: 73,
		DOM_VK_J: 74,
		DOM_VK_K: 75,
		DOM_VK_L: 76,
		DOM_VK_M: 77,
		DOM_VK_N: 78,
		DOM_VK_O: 79,
		DOM_VK_P: 80,
		DOM_VK_Q: 81,
		DOM_VK_R: 82,
		DOM_VK_S: 83,
		DOM_VK_T: 84,
		DOM_VK_U: 85,
		DOM_VK_V: 86,
		DOM_VK_W: 87,
		DOM_VK_X: 88,
		DOM_VK_Y: 89,
		DOM_VK_Z: 90,
		DOM_VK_CONTEXT_MENU: 93,
		DOM_VK_NUMPAD0: 96,
		DOM_VK_NUMPAD1: 97,
		DOM_VK_NUMPAD2: 98,
		DOM_VK_NUMPAD3: 99,
		DOM_VK_NUMPAD4: 100,
		DOM_VK_NUMPAD5: 101,
		DOM_VK_NUMPAD6: 102,
		DOM_VK_NUMPAD7: 103,
		DOM_VK_NUMPAD8: 104,
		DOM_VK_NUMPAD9: 105,
		DOM_VK_MULTIPLY: 106,
		DOM_VK_ADD: 107,
		DOM_VK_SEPARATOR: 108,
		DOM_VK_SUBTRACT: 109,
		DOM_VK_DECIMAL: 110,
		DOM_VK_DIVIDE: 111,
		DOM_VK_F1: 112,
		DOM_VK_F2: 113,
		DOM_VK_F3: 114,
		DOM_VK_F4: 115,
		DOM_VK_F5: 116,
		DOM_VK_F6: 117,
		DOM_VK_F7: 118,
		DOM_VK_F8: 119,
		DOM_VK_F9: 120,
		DOM_VK_F10: 121,
		DOM_VK_F11: 122,
		DOM_VK_F12: 123,
		DOM_VK_F13: 124,
		DOM_VK_F14: 125,
		DOM_VK_F15: 126,
		DOM_VK_F16: 127,
		DOM_VK_F17: 128,
		DOM_VK_F18: 129,
		DOM_VK_F19: 130,
		DOM_VK_F20: 131,
		DOM_VK_F21: 132,
		DOM_VK_F22: 133,
		DOM_VK_F23: 134,
		DOM_VK_F24: 135,
		DOM_VK_NUM_LOCK: 144,
		DOM_VK_SCROLL_LOCK: 145,
		DOM_VK_COMMA: 188,
		DOM_VK_PERIOD: 190,
		DOM_VK_SLASH: 191,
		DOM_VK_BACK_QUOTE: 192,
		DOM_VK_OPEN_BRACKET: 219,
		DOM_VK_BACK_SLASH: 220,
		DOM_VK_CLOSE_BRACKET: 221,
		DOM_VK_QUOTE: 222,
		DOM_VK_META: 224
	};
}
