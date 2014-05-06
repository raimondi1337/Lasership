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
		camera: undefined,
		myobjects: [],
		paused: false,
		dt: 1/60,
		controls: undefined,
		
		
    	init : function() {
			console.log('init called');
			this.setupThreeJS();
			this.setupWorld();
			this.update();
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
		this.renderer.render(this.scene, this.camera);
		
	},
	
	setupThreeJS: function() {
				this.scene = new THREE.Scene();
				this.scene.fog = new THREE.FogExp2(0x9db3b5, 0.002);

				this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.y = 400;
				this.camera.position.z = 400;
				this.camera.rotation.x = -45 * Math.PI / 180;

				this.renderer = new THREE.WebGLRenderer({antialias: true});
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.shadowMapEnabled = true;
				document.body.appendChild(this.renderer.domElement );

				this.controls = new THREE.FirstPersonControls(this.camera);
				this.controls.movementSpeed = 500;
				this.controls.lookSpeed = 0.1;
				this.controls.autoForward = false;
			},
			
	setupWorld: function() {
				var geo = new THREE.PlaneGeometry(2000, 2000, 40, 40);
				var mat = new THREE.MeshPhongMaterial({color: 'green', overdraw: false});
				var floor = new THREE.Mesh(geo, mat);
				floor.rotation.x = -0.5 * Math.PI;
				floor.receiveShadow = true;
				this.scene.add(floor);
			
				var p1geo = new THREE.CubeGeometry(100,100,100);
				var p1mat = new THREE.MeshBasicMaterial( { color: 'red' } ); 
				var player1 = new THREE.Mesh( p1geo, p1mat ); 
				this.scene.add( player1 );

				var p2geo = new THREE.CubeGeometry(100,100,100);
				var p2mat = new THREE.MeshBasicMaterial( { color: 'blue' } ); 
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

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	}
	
	
};