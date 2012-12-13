jQuery(function($){
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var c_width = 55.0;
var ppm = canvas.width/c_width;
var c_height = canvas.height/ppm;
ctx.setTransform(ppm, 0, 0, -ppm, 0, canvas.height);  
var worldAABB = new b2AABB();
worldAABB.lowerBound.Set(-10000.0, -10000.0);
worldAABB.upperBound.Set(10000.0, 10000.0);
var gravity = new b2Vec2(0.0, -9.8);
var world = new b2World(worldAABB, gravity, true);
window.world = world;

var groundBodyDef = new b2BodyDef();
groundBodyDef.position.Set(c_width/2.0, 3.0);
var groundBody = world.CreateBody(groundBodyDef);
var groundShapeDef = new b2PolygonDef();
groundShapeDef.restitution = 0.0;
groundShapeDef.friction = 0.5;
groundShapeDef.density = 1.0;
groundBody.w = c_width*1.0
groundBody.h = 5;
groundShapeDef.SetAsBox(groundBody.w, groundBody.h);
groundBody.CreateShape(groundShapeDef);
groundBody.SynchronizeShapes();

var bodiesSquares = [groundBody];
var bodiesCircles = [groundBody];
var explosionParticles = [];

	function createSquares(x, y) {
		var randomsize=Math.floor((Math.random()*2)+1);
		var bodyDef = new b2BodyDef();
		bodyDef.position.Set(x, y);
		var body = world.CreateBody(bodyDef);
		var shapeDef = new b2PolygonDef();
		shapeDef.SetAsBox(randomsize, randomsize);
		body.w = randomsize;
		body.h = randomsize;
		shapeDef.restitution = 0.0;
		shapeDef.density = 2.0;
		shapeDef.friction = 0.9;
		body.CreateShape(shapeDef);
		body.SetMassFromShapes();
		bodiesSquares.push(body);
	}
	function createCircles(x, y) {
		var ntracer = 25;
		var a = Math.PI/ntracer*2*i;
		var vx = Math.cos(a);
		var vy = Math.sin(a);
		var bodyDef = new b2BodyDef();
		bodyDef.position.Set(x+vx, y+vy);
		var body = world.CreateBody(bodyDef);
		var shapeDef = new b2CircleDef();
		shapeDef.radius = 1;
	
		shapeDef.restitution = 0.0;
		shapeDef.density = 2.0;
		shapeDef.friction = 0.9;
	
		body.CreateShape(shapeDef);
		body.SetMassFromShapes();
		body.w = 1.0;
		body.h = 1.0;
		bodiesCircles.push(body);
	}
	function loadnoexplode(x, y) {
		var ntracer = 25;
		while(explosionParticles.length){
			world.DestroyBody(explosionParticles.pop());
		}
		for(var i = 0; i < ntracer; i++) {
			var a = Math.PI/ntracer*2*i;
			var vx = Math.cos(a);
			var vy = Math.sin(a);
			var bodyDef = new b2BodyDef();
			bodyDef.position.Set(x+vx, y+vy);
			bodyDef.isBullet = true;
			var body = world.CreateBody(bodyDef);
			var shapeDef = new b2CircleDef();
			shapeDef.radius = 0.1;
			shapeDef.restitution = 0.0;
			shapeDef.density = 5000.0/ntracer;
			shapeDef.friction = 0.0;
			body.CreateShape(shapeDef);
			body.SetMassFromShapes();
			body.w = 1.0;
			body.h = 1.0;
			explosionParticles.push(body);
		}
	}
	function loadexplode(x, y) {
		var ntracer = 25;
		while(explosionParticles.length){
			world.DestroyBody(explosionParticles.pop());
		}
		for(var i = 0; i < ntracer; i++) {
			var a = Math.PI/ntracer*2*i;
			var vx = Math.cos(a);
			var vy = Math.sin(a);
			var bodyDef = new b2BodyDef();
			bodyDef.position.Set(x+vx, y+vy);
			bodyDef.isBullet = true;
			var body = world.CreateBody(bodyDef);
			var shapeDef = new b2CircleDef();
			shapeDef.radius = 0.1;
			shapeDef.restitution = 0.0;
			shapeDef.density = 5000.0/ntracer;
			shapeDef.friction = 0.0;
			body.CreateShape(shapeDef);
			body.SetMassFromShapes();
			body.ApplyImpulse({x: vx*25000, y:vy*25000}, {x:x, y:y});
			body.w = 1.0;
			body.h = 1.0;
			explosionParticles.push(body);
		}
		
	}	
	function explode(x, y) {
		var ntracer = 25;
		while(explosionParticles.length){
			world.DestroyBody(explosionParticles.pop());
		}
		for(var i = 0; i < ntracer; i++) {
			var a = Math.PI/ntracer*2*i;
			var vx = Math.cos(a);
			var vy = Math.sin(a);
			var bodyDef = new b2BodyDef();
			bodyDef.position.Set(x+vx, y+vy);
			bodyDef.isBullet = true;
			var body = world.CreateBody(bodyDef);
			var shapeDef = new b2CircleDef();
			shapeDef.radius = 0.1;
			shapeDef.restitution = 0.0;
			shapeDef.density = 5000.0/ntracer;
			shapeDef.friction = 0.0;
			body.CreateShape(shapeDef);
			body.SetMassFromShapes();
			body.ApplyImpulse({x: vx*25000, y:vy*25000}, {x:x, y:y});
			body.w = 1.0;
			body.h = 1.0;
			explosionParticles.push(body);
		}
	}
	$(canvas).click(function (e){
		var o = $(canvas).offset();
		var x = (e.pageX-o.left)/ppm;
		var y = (canvas.height-e.pageY+o.top)/ppm;
		explode(x, y);
		for(var i = 0; i < 20; i ++) {
		createCircles(c_width/2, c_height);
		createSquares(c_width/2, c_height);
		}
	});
	loadnoexplode(c_width/2,c_height+18);
	for(var i = 0; i < 30; i ++) {
		createSquares(c_width/2, c_height+15);
	    createCircles(c_width/2, c_height+18);
	   
	}
	
	
	window.setInterval(function() {
		world.Step(1.0/20.0, 10);
		ctx.clearRect(0.0, 0.0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, c_width, c_height);
		ctx.fillStyle = '#cccccc';
		ctx.strokeStyle = '#cccccc';
		ctx.lineWidth  = .04;	
		for(var i = 0; i < bodiesSquares.length; i++){
			var body = bodiesSquares[i];
			var t = body.m_xf;
			ctx.translate(t.position.x, t.position.y)
			ctx.rotate(body.GetAngle());
			ctx.strokeRect(-body.w, -body.h, body.w*2, body.h*2);
			ctx.rotate(-body.GetAngle());
			ctx.translate(-t.position.x, -t.position.y)
		}
		for(var i = 0; i < bodiesCircles.length; i++){
			var body = bodiesCircles[i];
			var t = body.m_xf;
			ctx.strokeStyle = "#cccccc";
			ctx.translate(t.position.x, t.position.y)
			ctx.beginPath();
			ctx.arc(0, 0, 1, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.stroke();
			ctx.translate(-t.position.x, -t.position.y)
		}
		
		for(var i = 0; i < explosionParticles.length; i++){
			ctx.fillStyle = 'red';
			var body = explosionParticles[i];
			var t = body.m_xf;
			ctx.translate(t.position.x, t.position.y)
			ctx.beginPath();
			ctx.arc(0, 0, 0.1, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
			ctx.translate(-t.position.x, -t.position.y)
		}
		ctx.fillStyle = 'transparent';
		ctx.save();
		ctx.setTransform(1,0,0,1,0,0);
		ctx.restore();
	}, 1000/30);
	});
jQuery.noConflict();