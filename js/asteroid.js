// bullet.js
// dependencies: none

"use strict";
var app = app || {};

app.Asteroid = function(){

	function Asteroid(renderer, cam, scene){
		var radius=(Math.random()*350)+50;
		var texture = THREE.ImageUtils.loadTexture('images/asteroid.jpg');
		var geo = new THREE.SphereGeometry(radius, 6, 6);
		var mat = new THREE.MeshBasicMaterial( { map: texture } ); 
		this.sphere = new THREE.Mesh(geo, mat);
		this.sphere.radius = radius;
		this.sphere.position.set((Math.random()*10000)-5000,(Math.random()*10000)-5000,(Math.random()*10000)-5000);
		
		var vector = new THREE.Vector3((Math.random()*500) - 250, (Math.random()*500)-250, (Math.random()*500)-250);
		this.sphere.ray = new THREE.Ray(new THREE.Vector3(0,0,0), vector.sub(this.sphere.position).normalize());
	}

	return Asteroid; 
}();
