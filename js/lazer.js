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
		originPoint: new THREE.Vector3(0, 0, 0),
		
		
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
					console.log("collided");
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
	
		var p1geo = new THREE.SphereGeometry(50, 6, 6);
		var p1mat = new THREE.MeshPhongMaterial( { color: 'red' } ); 
		var player1 = new THREE.Mesh( p1geo, p1mat ); 
		this.asteroids.push(player1);
		this.scene.add( player1 );

		var p2geo = new THREE.SphereGeometry(50, 6, 6);
		var p2mat = new THREE.MeshPhongMaterial( { color: 'blue' } ); 
		var player2 = new THREE.Mesh( p2geo, p2mat );
		this.asteroids.push(player2); 
		this.scene.add( player2 ); 
	
		player1.position.x = 0;
		player1.position.y = 100;
		player1.position.z = 900;				
	
		player2.position.x = 0;
		player2.position.y = 100;
		player2.position.z = -900;
		
		//move pivot point to bottom of cube instead of center
		//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0.5,0));
	},
			
			
	createBullet: function(obj) {
		var sphereMaterial = new THREE.MeshBasicMaterial({color: 'red'});
		var sphereGeo = new THREE.SphereGeometry(50, 6, 6);
		if (this.obj === undefined) {
			this.obj = this.cam;
		}
		var sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
		sphere.position.set(this.obj.position.x, this.obj.position.y * .75, this.obj.position.z);
	 
		if (this.obj instanceof THREE.Camera) {
			var vector = new THREE.Vector3(this.mouseX, this.mouseY, 1);
			this.projector.unprojectVector(vector, this.obj);
			sphere.ray = new THREE.Ray(
					this.obj.position,
					vector.sub(this.obj.position).normalize()
			);
			
		}
		else {
			var vector = this.cam.position.clone();
			sphere.ray = new THREE.Ray(
					this.obj.position,
					vector.sub(this.obj.position).normalize()
			);
		}
		sphere.owner = this.obj;
	 
		this.bullets.push(sphere);
		this.scene.add(sphere);
	 
		return this.sphere;
	},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	},

	sphereCollision: function(sphere1,sphere2){
		return sphere1.position.distanceToSquared(sphere2.position) < 10000;
	}
	
	
};