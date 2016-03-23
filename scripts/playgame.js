function Event(interval,timesRemaining,name,func){
    return {
        "timesRemaining":timesRemaining,
        "name":name,
        "interval":interval,
        "func":func,
        "timeRemaining":interval
    };
}

MyGame.screens['PlayGame']=(function(game,graphics,input,scoring){
    var prevTimestamp=performance.now();
    var keyBoard=input.Keyboard();
    var eventList=[];

    
    var run=function(){
        initializeGameObjects();
        //add functions to listen to key listners in here
        prevTimestamp=performance.now();
        addFlowkeyListeners();
        requestAnimationFrame(gameloop)
    };
    var initialize=function(){

        
    };

    function Gameover(){
        document.getElementById('continueButton').style.display='none';//hides continue from user in case of game over
        document.getElementById('overlay_menu').style.display='block';
        cleanUp();
        addFlowkeyListeners();
    }
    function PauseGame(){
        document.getElementById('continueButton').style.display='inline-block';
        document.getElementById('overlay_menu').style.display='block';
        cleanUp();
        addFlowkeyListeners();
    }
    
    
    function reset(){
        cleanUp();
        initializeGameObjects();
    }
    
    function exitGame(){
        cleanUp();
        game.show('MainMenu');
    }
    
    
    function gameloop(timestamp){
        var elapsed=timestamp-prevTimestamp;
        prevTimestamp=timestamp;
        processInput(elapsed);
        for(var i=0;i<4;i++)
            update(elapsed/4);
        render(elapsed);
        requestAnimationFrame(gameloop);
    }
    
    
    function processInput(elapsed){
        keyBoard.update(elapsed);
    }
    
    function render(elapsed){
        graphics.clear();
    }
    
   
    function removeDoneEvents(){
        for(var i=eventList.length-1; i>=0;i--){
            if(eventList[i].timesRemaining===0){
                eventList.splice(i,1);
            }
        }
    }
   
    function updateEventQueue(elapsed){
        removeDoneEvents();
        for(var i=0; i<eventList.length;i++){
            eventList[i].timeRemaining-=elapsed;
            if(eventList[i].timeRemaining<=0){
                eventList[i].timeRemaining=eventList[i].interval;
                eventList[i].timesRemaining-=1;
                eventList[i].func(elapsed);
                                
            }
        }
    }
    
    function update(elapsed){
        updateEventQueue(elapsed);        
    }
    
    function addFlowkeyListeners(){
        document.getElementById('backButton_PG').addEventListener(
            'click',
			function() {exitGame(); }
        );
    }

    function initializeGameObjects(){

    }
    
    function cleanUp(){
        //remove keyListners
        keyBoard=input.Keyboard();
    }

    return{
        run:run,
        initialize:initialize
        
    }
}(MyGame.game,MyGame.graphics,MyGame.input,MyGame.persitantScore));