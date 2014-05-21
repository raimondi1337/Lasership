var app = app || {};

app.hud = {
	setup: function(){
		this.canvas = document.body.appendChild(document.createElement('canvas'));
		this.canvas.style.position = "absolute";
		this.canvas.style.top = "0";
		this.canvas.style.left = "0";
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext('2d');
	},
	draw: function(){
		//draw score
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.fillStyle='red';
		this.ctx.font='20px Courier';
		this.ctx.fillText(app.lazer.score,40,40);

		//draw crosshair
		this.ctx.fillRect((this.canvas.width/2)-2,(this.canvas.height/2)-2,4,4);
	}
}