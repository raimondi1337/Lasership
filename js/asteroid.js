// bullet.js
// dependencies: none

"use strict";
var app = app || {};

app.Asteroid = function(){

	function Asteroid(){
		var radius=(Math.random()*350)+50;
		var geo = new THREE.SphereGeometry(radius, 6, 6);
		var mat = new THREE.MeshPhongMaterial( { color: 'blue' } ); 
		this.sphere = new THREE.Mesh(geo, mat);
		this.sphere.radius = radius;
		this.sphere.position.set((Math.random()*10000)-5000,(Math.random()*10000)-5000,(Math.random()*10000)-5000);
	}

	return Asteroid; 
}();
