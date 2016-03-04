var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mapWidth = 2000;
var mapHeight = 2000;
var ctx = canvas.getContext('2d');
var bgReady = false;
var bgImage = new Image();
var characterReady = false;
var characterImage = new Image();

var me = {
	speed: 256, // movement in pixels per second
	width: 27,
	height: 50
};

function resize_canvas(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

function generate_terrain(){
	bgImage.onload = function () {
		bgReady = true;
	};
	bgImage.src = "assets/images/sprites/terrain/forest_tiles.png";
}
function generate_character(){
	characterImage.onload = function () {
		characterReady = true;
	};
	characterImage.src = "assets/images/sprites/characters/me0.png";
}


var init = function () {
	me.x = canvas.width / 2;
	me.y = canvas.height / 2;
	generate_terrain();
	generate_character();
};

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		me.y -= me.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		me.y += me.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		me.x -= me.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		me.x += me.speed * modifier;
	}
	if (me.x < 20) me.x = 20;
    if (me.y < 20) me.y = 20;
    if (me.x > mapWidth-20) me.x = mapWidth-20;
    if (me.y > mapHeight-20) me.y = mapHeight-20;
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var camX = clamp(-me.x + canvas.width/2, 0, mapWidth - canvas.width);
    var camY = clamp(-me.y + canvas.height/2, 0, mapHeight- canvas.height);

    ctx.translate( camX, camY ); 
};

function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
}

var render = function () {
	if (bgReady) {
		var pat=ctx.createPattern(bgImage,"repeat");
		ctx.rect(0,0, canvas.width, canvas.height);
		ctx.fillStyle=pat;
		ctx.fill();
	}
	if (characterReady) {
		ctx.drawImage(characterImage, me.x, me.y);
	}
};

var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	then = now;
	render();
	requestAnimationFrame(main);
};
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
init();
main();