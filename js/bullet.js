// bullet.js
// dependencies: none

"use strict";
var app = app || {};

app.Bullet = function(){

	function Bullet(obj){
		var radius = 50;
		var sphereMaterial = new THREE.MeshBasicMaterial({color: 'red'});
		var sphereGeo = new THREE.SphereGeometry(radius, 6, 6);
		if (obj === undefined) {
			obj = app.lazer.cam;
		}
		this.sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
		this.sphere.position.set(obj.position.x, obj.position.y * .75, obj.position.z);
	 
		if (obj instanceof THREE.Camera) {
			var vector = new THREE.Vector3(0, 0, 0);
			app.lazer.projector.unprojectVector(vector, obj);
			this.sphere.ray = new THREE.Ray(obj.position, vector.sub(obj.position).normalize());
			
		}
		else {
			var vector = app.lazer.cam.position.clone();
			this.sphere.ray = new THREE.Ray(obj.position, vector.sub(obj.position).normalize());
		}
		this.sphere.owner = obj;
		this.sphere.radius=radius;
	}

	return Bullet; 
}();
