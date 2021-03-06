/**********************************************************
	projectile components including:
		projectile constructors
**********************************************************/

PROJECTILETYPE = Object.freeze({BOMB: "BOMB", FREEZE: "FREEZE", MISSILE:"MISSILE",PELLET:"PELLET"});


MyGame.components.projectiles = (function(spec){
	"use strict"
	/**********************************************************
		The Projectile Manager
			Knows about all the projectiles
			Creates projectiles

	**********************************************************/
	var ProjectileManager = function(spec){
		var that = {};
		var startProjectileId = 0;
		var nextProjectileId = 0;
		var projectiles = [];

		var projectileCountMatrix = (function(){
			//initialize all matrix values at 0
			return [];
		}());

		that.forEach = function(func){
			for(let i=startProjectileId; i<nextProjectileId; i++){
				if(projectiles[i] !== undefined){
					func(projectiles[i]);//.update(elapsedTime);
				}
			}
		}

		that.getProjectileCountIJ = function(ij){
			return projectileCountMatrix[ij.i, ij.j];
		}

		that.getProjectileCountXY = function(xy){
			var ij = MyGame.components.xy2ij(xy);
			return getProjectileCountIJ(ij);
		}

		/**********************************************************
			Projectile Creator
			projectileSpec:{drawable, initialVelocity,initialLocation,initialTimeRemaining, projectileSpeed}
		**********************************************************/
		that.create = function(projectileSpec){
			projectileSpec.id = nextProjectileId++;
			projectileSpec.projectileListener = that;

			var projectile = Projectile(projectileSpec);

			projectiles[projectileSpec.id] = projectile;
			//increment projectileCountMatrix
		}

		function cleenUpProjectiles(){
			let done = false;
			for(let i=startProjectileId; i<nextProjectileId && !done; i++){
				if(projectiles[i] === undefined){
					startProjectileId = i+1;
				}else{
					done = true;
				}
			}
		}

		that.update = function(elapsedTime){
			for(let i=startProjectileId; i<nextProjectileId; i++){
				if(projectiles[i] !== undefined){
                    if(projectiles[i].type===PROJECTILETYPE.BOMB){
                        spec.particleSystem.createBombTrailParticles(projectiles[i]);
                    }else if(projectiles[i].type===PROJECTILETYPE.MISSILE){
                        spec.particleSystem.createMissleTrailParticles(projectiles[i]);
                    }
                    projectiles[i].update(elapsedTime);
				}
			}

			cleenUpProjectiles();
		}

		that.render = function(elapsedTime){
			for(let i=startProjectileId; i<nextProjectileId; i++){
				if(projectiles[i] !== undefined){
					projectiles[i].draw(elapsedTime);
				}
			}
		}

		//projectile listener functions
		that.projectileKilled = function(projectile){
			//decrement projectileCountMatrix

			delete projectiles[projectile.getID()];
		}

		that.projectileMoved = function(projectile, oldLocation, newLocation){
			//update projectileCountMatrix
		}

		return that;
	}


	/**********************************************************
		The Projectile
			knows what it looks like
			knows where it is
			knows where it needs to go
				knows how to find out how to get there
			takes a projectileListener which is just any object that has the functions:
				projectileKilled(id)
                projectileMoved(projectile,old)

		spec:{id, initialLocation,initialTimeRemaining,initialVelocity, drawable,  projectileSpeed, projectileListener}
	**********************************************************/
	var Projectile = function(spec){
		var that = {};
        that.type=spec.type;
        that.damage=spec.damage;
		var currentLocation = (function(){
			var ij = MyGame.components.xy2ij(spec.initialLocation);
			return {
				x:spec.initialLocation.x, y:spec.initialLocation.y, i:ij.i, j:ij.j
			}
		}());
		var velocity=spec.initialVelocity;
        var timeRemaining=spec.initialTimeRemaining;
		function updateCurrentLocationIJ(){
			var oldLocation = {i:currentLocation.i, j:currentLocation.j};

			//convert currentLocation x,y to i,j
			var ij = MyGame.components.xy2ij(currentLocation);
			//and add to currentLocation
			currentLocation.i=ij.i;
			currentLocation.j=ij.j;

			if(oldLocation.i!==currentLocation.i || oldLocation.j!==currentLocation.j){
				spec.projectileListener.projectileMoved(that, oldLocation,currentLocation);
			}
		}
		updateCurrentLocationIJ();

		that.getLocation = function (){
			return currentLocation;
		}

		that.getID = function(){
			return spec.id;
		}
        
		/**********************************************************
		* update projectile
		**********************************************************/
		that.update = function(elapsedTime){
            
            if(that.type===PROJECTILETYPE.MISSILE&&spec.creep!==undefined&&spec.creep.getHP()>0&&spec.creep.getDistanceFromEndGoal()!==0){
                var normx=spec.creep.getDims().center.x-currentLocation.x;
                var normy=spec.creep.getDims().center.y-currentLocation.y;
                var destang=Math.atan(normy/normx)+(normx>=0?+Math.PI:0)+Math.PI;
                /*var rotation=Math.atan(velocity.y/velocity.x)+ (velocity.x>=0?+Math.PI:0);
                destang-=rotation;
                if(destang<0){
                    destang+=Math.PI*2;
                }
                if(destang>Math.PI){
                    rotation-=50*elapsedTime/10000;
                }else{
                    rotation+=50*elapsedTime/10000;
                }*/
                var dis=Math.sqrt(velocity.x*velocity.x+velocity.y*velocity.y);
                velocity.x=Math.cos(destang)*dis;
                velocity.y=Math.sin(destang)*dis;
            }
            
            currentLocation.x += velocity.x*elapsedTime/1000;
            currentLocation.y += velocity.y*elapsedTime/1000;
            timeRemaining-=elapsedTime
            if(timeRemaining<=0||!Collision.circleRect(that.getDims(),MyGame.components.arena)){
                spec.projectileListener.projectileKilled(that);
            };
            updateCurrentLocationIJ();
        }


		/**********************************************************
		* render projectile
		**********************************************************/
		var dims = {radius:spec.radius};
        that.getDims=function(){
            dims.center = currentLocation;
            return dims
        }
		that.draw = function(elapsedTime){
			dims.center = currentLocation;
            dims.velocity=velocity;
			//update sprite
            if(spec.drawable.hasOwnProperty("update")){
				spec.drawable.update(elapsedTime);
			}
			spec.drawable.draw(dims);
		}
        that.getDrawable = function(){
			return spec.drawable;
		}
        

		return that;
	}


	return {
		ProjectileManager:ProjectileManager
	};
}());
