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
			
		for (var i = this.bullets.length-1; i >= 0; i--) {
			
			var b = this.bullets[i], p = b.position, d = b.ray.direction;

			for(var j = this.asteroids.length-1;j>=0;j--){
				var a = this.asteroids[j];
				if (this.sphereCollision(b,a)){
					this.bullets.splice(i,1);
					this.scene.remove(this.bullets[i]);
					this.asteroids.splice(j,1);
					this.scene.remove(this.asteroids[j]);
				}
			}
			
			var hit = false;
			if (!hit) {
				b.translateX(speed * d.x);
				b.translateY(speed * d.y);
				b.translateZ(speed * d.z);
			}

			if(this.bullets.length>50){
				this.bullets.splice(0, 1);
				this.scene.remove(this.bullets[0]);
			}
		}
		
	},
	
	setupThreeJS: function() {
		this.scene = new THREE.Scene();
		
		this.projector = new THREE.Projector();
		
		this.light = new THREE.HemisphereLight( '#999999', '#ffAAAA', 5); 
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
		var geo = new THREE.PlaneGeometry(2000, 2000, 40, 40);
		var mat = new THREE.MeshPhongMaterial({color: 'green'});
		var floor = new THREE.Mesh(geo, mat);
		floor.rotation.x = -0.5 * Math.PI;
		floor.receiveShadow = true;
		this.scene.add(floor);

		for(var i=0;i<500;i++){
			var a = new app.Asteroid();

			this.asteroids.push(a.sphere);
			this.scene.add(a.sphere);
		}
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
		return sphere1.position.distanceToSquared(sphere2.position) < sphere1.radius+sphere2.radius;
	}
	
	
};