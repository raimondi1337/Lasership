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
		score: 0,
		worldRadius: 10000,
		
		
    	init : function() {
			this.setupThreeJS();
			this.setupWorld();
			this.update();
			// Shoot on click
			window.addEventListener('click', function(e) {
				e.preventDefault();
				if (e.which === 1) { // Left click only, courtesy of jQuery
					app.lazer.createBullet(); // Shoot a bullet. Described later
					createjs.Sound.play("bullet", {volume:0.5});
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
					this.score+=10;
					this.scene.remove(this.bullets[i]);
					this.bullets.splice(i,1);
					this.scene.remove(this.asteroids[j]);
					this.asteroids.splice(j,1);
					createjs.Sound.play("splode", {volume:0.5});
				}
			}
		}
		
		for (var i = this.bullets.length-1; i >= 0; i--) {
			var b = this.bullets[i], d = b.ray.direction;
			
			b.translateX(speed * d.x);
			b.translateY(speed * d.y);
			b.translateZ(speed * d.z);
			
			if(this.bullets.length>50){
				this.scene.remove(this.bullets[0]);
				this.bullets.splice(0, 1);
			}
		}
	
		for(var j = this.asteroids.length-1;j>=0;j--){
			var a = this.asteroids[j];

			a.rotation.x += (Math.random()*(Math.PI /180));
			a.rotation.y += (Math.random()*(Math.PI /180));
			a.rotation.z += (Math.random()*(Math.PI /180));

			a.translateX(speed/15 * a.ray.direction.x);

			if(a.position.distanceToSquared(this.skybox.position) > Math.pow(this.worldRadius,2)){
				this.scene.remove(this.asteroids[j]);
				this.asteroids.splice(j,1);
			}
		}

		if(this.asteroids.length < 50){
			var newA = new app.Asteroid(this.renderer, this.cam, this.scene);

			this.asteroids.push(newA.sphere);
			this.scene.add(newA.sphere);
		}

		this.skybox.position.x=this.cam.position.x;
		this.skybox.position.z=this.cam.position.z;
		this.skybox.position.y=this.cam.position.y;

		app.hud.draw();
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
		app.hud.setup();

		//skybox
		var texture = THREE.ImageUtils.loadTexture('images/galaxy.jpg');
		var geo = new THREE.SphereGeometry(this.worldRadius, 10, 10);
		var mat = new THREE.MeshBasicMaterial( { map: texture } );

		this.skybox = new THREE.Mesh(geo, mat);
		this.skybox.material.side = THREE.BackSide
		this.scene.add(this.skybox);
	},
			
			
	createBullet: function(obj) {
		var b = new app.Bullet(this.cam);
		this.bullets.push(b.sphere);
		this.scene.add(b.sphere);
	},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	},

	sphereCollision: function(sphere1,sphere2){
		return sphere1.position.distanceTo(sphere2.position) < (sphere1.radius+sphere2.radius);
	},
	
	startSoundtrack: function(){
		createjs.Sound.stop();
		createjs.Sound.play("loop", {loop:-1, volume:0.2});
	}
};