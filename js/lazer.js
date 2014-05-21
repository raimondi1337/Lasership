// lazer.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.lazer = {
    	// CONSTANT properties
    	
		// variable properties
		renderer: undefined,
		scene: undefined,
		cam: undefined,
		myobjects: [],
		paused: false,
		dt: 1/60,
		controls: undefined,
		light: undefined,
		bullets: [],
		asteroids: [],
		sphere: undefined,
		BulletMoveSpeed: 5000,
		projector: undefined,
		skybox: undefined,
		
		
    	init : function() {
			this.setupThreeJS();
			this.setupWorld();
			this.update();
			// Shoot on click
			window.addEventListener('click', function(e) {
				e.preventDefault();
				if (e.which === 1) { // Left click only, courtesy of jQuery
					app.lazer.createBullet(); // Shoot a bullet. Described later
				}
			});
    	},
    	
    	
    update: function(){
    	// schedule next animation frame
    	app.animationID = requestAnimationFrame(this.update.bind(this));
    	
		// PAUSED?
		if (app.paused){
			this.drawPauseScreen();
			return;
		 }
	
		// UPDATE
		this.controls.update(this.dt);
		
		// DRAW	
		this.renderer.render(this.scene, this.cam);
		
		var speed = this.dt*this.BulletMoveSpeed;
		
		
		for(var j = this.asteroids.length-1;j>=0;j--){
			var a = this.asteroids[j];		
			
			for (var i = this.bullets.length-1; i >= 0; i--) {
		
				var b = this.bullets[i], d = b.ray.direction;			
				
				if (this.sphereCollision(b,a)){
					createjs.Sound.play("splode", {volume:0.5});
					this.scene.remove(this.bullets[i]);
					this.bullets.splice(i,1);
					this.scene.remove(this.asteroids[j]);
					this.asteroids.splice(j,1);
				}
			}
		}
		
		for (var i = this.bullets.length-1; i >= 0; i--) {
			var b = this.bullets[i], d = b.ray.direction;
			
			b.translateX(speed * d.x);
			b.translateY(speed * d.y);
			b.translateZ(speed * d.z);
			
			if(this.bullets.length>50){
				this.bullets.splice(0, 1);
				this.scene.remove(this.bullets[0]);
			}
		}
	
		for(var j = this.asteroids.length-1;j>=0;j--){
			var a = this.asteroids[j];
		
			/*a.translateX(speed/2 * a.ray.direction.x);
			a.translateY(speed/2 * a.ray.direction.y);
			a.translateZ(speed/2 * a.ray.direction.z);*/
			a.rotation.x += (Math.random()*(Math.PI /180));
			a.rotation.y += (Math.random()*(Math.PI /180));
			a.rotation.z += (Math.random()*(Math.PI /180));
		}
	},
	
	setupThreeJS: function() {
		this.scene = new THREE.Scene();
		
		this.projector = new THREE.Projector();
		
		this.light = new THREE.HemisphereLight( '#999999', '#AAAAAA', 5); 
		this.light.position.set( 50, 50, 50 ); 
		this.scene.add( this.light );

		this.cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		this.cam.position.y = 400;
		this.cam.position.z = 400;
		this.cam.rotation.x = -45 * Math.PI / 180;

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMapEnabled = true;
		document.body.appendChild(this.renderer.domElement );

		this.controls = new THREE.FirstPersonControls(this.cam);
		this.controls.movementSpeed = 500;
		this.controls.lookSpeed = 0.1;
		this.controls.autoForward = true;
	},
			
	setupWorld: function() {
		for(var i=0;i<50;i++){
			var a = new app.Asteroid(this.renderer, this.cam, this.scene);

			this.asteroids.push(a.sphere);
			this.scene.add(a.sphere);
		}
	},
			
			
	createBullet: function(obj) {
		var b = new app.Bullet(this.cam);
		this.bullets.push(b.sphere);
		this.scene.add(b.sphere);
		createjs.Sound.play("bullet", {volume:0.5});
	},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	},

	sphereCollision: function(sphere1,sphere2){
		return sphere1.position.distanceTo(sphere2.position) < (sphere1.radius+sphere2.radius);
	},
	
	startSoundtrack: function(){
		createjs.Sound.stop();
		createjs.Sound.play("loop", {loop:-1, volume:0.5});
	}
	
	
};