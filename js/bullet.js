// bullet.js
// dependencies: none

"use strict";
var app = app || {};

app.Bullet = function(){

	function Bullet(obj){
		var radius = 50;
		//Give bullet a texture
		var texture = THREE.ImageUtils.loadTexture('images/bullet.jpg');
		texture.needsUpdate = true;
		
		//set up a bullet
		var sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
		var sphereGeo = new THREE.SphereGeometry(radius, 6, 6);
		if (obj === undefined) {
			obj = app.lazer.cam;
		}
		this.sphere = new THREE.Mesh(sphereGeo, sphereMaterial);
		this.sphere.position.set(obj.position.x, obj.position.y, obj.position.z);
		
		//give the bullet a vector based on the ray of the camera
		if (obj instanceof THREE.Camera) {
			var vector = new THREE.Vector3(0, 0, 1);
			app.lazer.projector.unprojectVector(vector, obj);
			this.sphere.ray = new THREE.Ray(obj.position, vector.sub(obj.position).normalize());
			
		}
		else {
			var vector = app.lazer.cam.position.clone();
			this.sphere.ray = new THREE.Ray(obj.position, vector.sub(obj.position).normalize());
		}
		this.sphere.owner = obj;
		this.sphere.radius=radius;
		
		//starting translation so the bullet will come out of the camera at the same point
		this.sphere.translateX(200 * this.sphere.ray.direction.x);
		this.sphere.translateY(200 * this.sphere.ray.direction.y);
		this.sphere.translateZ(200 * this.sphere.ray.direction.z);

	}

	return Bullet; 
}();
