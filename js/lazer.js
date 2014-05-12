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
		
		
    	init : function() {
			console.log('init called');
			this.setupThreeJS();
			this.setupWorld();
			this.update();
			
			/*this.click : function(e) {
				e.preventDefault();
				if (e.which === 1) { // Left click only, courtesy of jQuery
					createBullet(); // Shoot a bullet. Described later
				}
			};*/
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
		
		
		
		
	},
	
	setupThreeJS: function() {
				this.scene = new THREE.Scene();
				
				this.light = new THREE.HemisphereLight( 'yellow', '#ffAAAA', 10); 
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
				this.controls.autoForward = false;
			},
			
	setupWorld: function() {
				var geo = new THREE.PlaneGeometry(2000, 2000, 40, 40);
				var mat = new THREE.MeshPhongMaterial({color: 'green'});
				var floor = new THREE.Mesh(geo, mat);
				floor.rotation.x = -0.5 * Math.PI;
				floor.receiveShadow = true;
				this.scene.add(floor);
			
				var p1geo = new THREE.CubeGeometry(100,100,100);
				var p1mat = new THREE.MeshPhongMaterial( { color: 'red' } ); 
				var player1 = new THREE.Mesh( p1geo, p1mat ); 
				this.scene.add( player1 );

				var p2geo = new THREE.CubeGeometry(100,100,100);
				var p2mat = new THREE.MeshPhongMaterial( { color: 'blue' } ); 
				var player2 = new THREE.Mesh( p2geo, p2mat ); 
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
				this.sphere.position.set(this.obj.position.x, this.obj.position.y * 0.8, this.obj.position.z);
			 
				if (this.obj instanceof THREE.Camera) {
					var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
					this.projector.unprojectVector(this.vector, this.obj);
					this.sphere.ray = new THREE.Ray(
							this.obj.position,
							this.vector.subSelf(this.obj.position).normalize()
					);
				}
				else {
					var vector = this.cam.position.clone();
					this.sphere.ray = new THREE.Ray(
							this.obj.position,
							this.vector.subSelf(this.obj.position).normalize()
					);
				}
				this.sphere.owner = this.obj;
			 
				this.bullets.push(sphere);
				this.scene.add(sphere);
			 
				return this.sphere;
			},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	}
	
	
};