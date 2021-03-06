/*
loader.js
variable app is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the bubbles game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// CONSTANTS of app
app.KEYBOARD = {
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

app.IMAGES ={
	asteroidImage: "images/asteroid.jpg",
	bulletImage: "images/bullet.jpg"
};

// properties of app
app.animationID = undefined;
app.paused = false;

// key daemon array
app.keydown = [];

(function(){
	var queue = new createjs.LoadQueue(false);
	queue.on("fileload", handleFileLoad, this);
	queue.on("complete", complete, this);
	queue.loadFile("js/lib/three.min.js");
	queue.loadFile("js/lib/FirstPersonControls.js");
	queue.loadFile("js/lazer.js");
	queue.loadFile("js/bullet.js");
	queue.loadFile("js/asteroid.js");
	queue.loadFile("js/hud.js");
	queue.loadFile(app.IMAGES['asteroidImage']);
	queue.loadFile(app.IMAGES['bulletImage']);

	
	function handleFileLoad(e){
		console.log(e + " loaded");
	}
	
	function handleComplete(e){
		//app.lazer.init();
	}
	
	// when the loading is complete, this function will be called
		 function complete(){
			
			// set up event handlers
			window.onblur = function(){
				app.paused = true;
				cancelAnimationFrame(app.animationID);
				app.keydown = []; // clear key daemon
				// call update() so that our paused screen gets drawn
				app.lazer.update();
			};
			
			window.onfocus = function(){
				app.paused = false;
				cancelAnimationFrame(app.animationID);
				// start the animation back up
				app.lazer.update();
			};
			
			// event listeners
			window.addEventListener("keydown",function(e){
				app.keydown[e.keyCode] = true;
			});
				
			window.addEventListener("keyup",function(e){
				app.keydown[e.keyCode] = false;
			});
			
			createjs.Sound.alternateExtensions = ["mp3"];
			createjs.Sound.registerSound({id:"loop", src:"sounds/loop.mp3"});
			createjs.Sound.registerSound({id:"bullet", src:"sounds/bullet.mp3"});
			createjs.Sound.registerSound({id:"splode", src:"sounds/splode.mp3"});
			
			createjs.Sound.addEventListener("fileload", handleFileLoad);
			
			function handleFileLoad(e){
				console.log("Preloaded Sound:", e.id, e.src);
				if(e.src == "sounds/loop.mp3") app.lazer.startSoundtrack();
			}
			
			
			// start game
			app.lazer.init();
		} // end complete

}());



		
		
		

