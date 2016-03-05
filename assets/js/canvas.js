const LEFTMARGIN = 5;
const RIGHTMARGIN = 20;

var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mapWidth = 5000;
var mapHeight = 1500;
var ctx = canvas.getContext('2d');
var bgReady = false;
var bgImage = new Image();
var characterReady = false;
var characterS = new Image(), characterS1 = new Image(), characterS2 = new Image();
var characterN = new Image(), characterN1 = new Image(), characterN2 = new Image();
var characterE = new Image(), characterE1 = new Image(), characterE2 = new Image();
var characterW = new Image(), characterW1 = new Image(), characterW2 = new Image();
var characterSW = new Image(), characterSW1 = new Image(), characterSW2 = new Image();
var characterNW = new Image(), characterNW1 = new Image(), characterNW2 = new Image();
var characterSE = new Image(), characterSE1 = new Image(), characterSE2 = new Image();
var characterNE = new Image(), characterNE1 = new Image(), characterNE2 = new Image();

const characterDirection = {
	N: 1,
	NE: 2,
	E: 3,
	SE: 4,
	S: 5,
	SW: 6,
	W: 7,
	NW: 8
} 

var me = {
	speed: 256, // movement in pixels per second
	walkingTimer: 256,
	walkAnimation: 0,
	direction: characterDirection.S,
	width: 0,
	height: 0
};

window.onresize = function(event) {
    resize_canvas();
    render();
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
	characterS.onload = function () {
			characterReady = true;
			me.width = characterS.naturalWidth;
			me.height = characterS.naturalHeight;
	};
	characterS.src = "assets/images/sprites/characters/meS.png",characterS1.src = "assets/images/sprites/characters/meS1.png",characterS2.src = "assets/images/sprites/characters/meS2.png";
	characterN.src = "assets/images/sprites/characters/meN.png",characterN1.src = "assets/images/sprites/characters/meN1.png",characterN2.src = "assets/images/sprites/characters/meN2.png";
	characterE.src = "assets/images/sprites/characters/meE.png",characterE1.src = "assets/images/sprites/characters/meE1.png",characterE2.src = "assets/images/sprites/characters/meE2.png";
	characterW.src = "assets/images/sprites/characters/meW.png",characterW1.src = "assets/images/sprites/characters/meW1.png",characterW2.src = "assets/images/sprites/characters/meW2.png";
	characterSW.src = "assets/images/sprites/characters/meSW.png",characterSW1.src = "assets/images/sprites/characters/meSW1.png",characterSW2.src = "assets/images/sprites/characters/meSW2.png";
	characterNW.src = "assets/images/sprites/characters/meNW.png",characterNW1.src = "assets/images/sprites/characters/meNW1.png",characterNW2.src = "assets/images/sprites/characters/meNW2.png";
	characterSE.src = "assets/images/sprites/characters/meSE.png",characterSE1.src = "assets/images/sprites/characters/meSE1.png",characterSE2.src = "assets/images/sprites/characters/meSE2.png";
	characterNE.src = "assets/images/sprites/characters/meNE.png",characterNE1.src = "assets/images/sprites/characters/meNE1.png",characterNE2.src = "assets/images/sprites/characters/meNE2.png";
}


var init = function () {
	me.x = mapWidth/2;
	me.y = mapHeight-100;
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
	if (!((38 in keysDown && 40 in keysDown) || (37 in keysDown && 39 in keysDown))){
		if (38 in keysDown) { // Player holding up
			me.direction = characterDirection.N;
			me.y -= me.speed * modifier;
		}else if (40 in keysDown) { // Player holding down
			me.direction = characterDirection.S;
			me.y += me.speed * modifier;
		}
		if (37 in keysDown) { // Player holding left
			if(38 in keysDown){
				me.direction = characterDirection.NW;
			}else if (40 in keysDown){
				me.direction = characterDirection.SW;
			}else{
				me.direction = characterDirection.W;
			}
			me.x -= me.speed * modifier;
		}else if (39 in keysDown) { // Player holding right
			if(38 in keysDown){
				me.direction = characterDirection.NE;
			}else if (40 in keysDown){
				me.direction = characterDirection.SE;
			}else{
				me.direction = characterDirection.E;
			}
			me.x += me.speed * modifier;
		}
		if (37 in keysDown || 38 in keysDown || 39 in keysDown || 40 in keysDown){
			me.walkingTimer -= (me.speed * modifier)*5;
			if (me.walkingTimer<0){
				me.walkingTimer = me.speed;
				me.walkAnimation++;
			}
			if (me.walkAnimation >3){
				me.walkAnimation=0;
			}
		} else{
			me.walkAnimation=0;
		}

		if (me.x < LEFTMARGIN) me.x = LEFTMARGIN;
	    if (me.y < RIGHTMARGIN) me.y = RIGHTMARGIN;
	    if (me.x > mapWidth-LEFTMARGIN-me.width) me.x = mapWidth-LEFTMARGIN-me.width;
	    if (me.y > mapHeight-RIGHTMARGIN-me.height) me.y = mapHeight-RIGHTMARGIN-me.height;

	    setCameraViewPort();
	}
};

function setCameraViewPort(){
    ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var camX = -me.x + canvas.width/2;
    var camY = -me.y + canvas.height/2;
    if (me.x <= canvas.width/2){
    	camX = 0;
    } else if (me.x >= mapWidth - canvas.width/2){
    	camX = canvas.width - mapWidth;
    }
    if (me.y <= canvas.height/2){
    	camY = 0;
    } else if (me.y >= mapHeight - canvas.height/2){
    	camY = canvas.height - mapHeight;
    }

    ctx.translate( camX, camY );
}

function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
}

var render = function () {
	if (bgReady) {
		var pat=ctx.createPattern(bgImage,"repeat");
		ctx.rect(0,0, mapWidth, mapHeight);
		ctx.fillStyle=pat;
		ctx.fill();
	}
	if (characterReady) {
		drawCharacter();
	}
};

var drawCharacter = function(){
	switch(me.direction){
		case characterDirection.N:
			if(me.walkAnimation == 1)ctx.drawImage(characterN1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterN2, me.x, me.y);
			else ctx.drawImage(characterN, me.x, me.y);
			break;
		case characterDirection.NE:
			if(me.walkAnimation == 1)ctx.drawImage(characterNE1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterNE2, me.x, me.y);
			else ctx.drawImage(characterNE, me.x, me.y);
			break;
		case characterDirection.E:
			if(me.walkAnimation == 1)ctx.drawImage(characterE1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterE2, me.x, me.y);
			else ctx.drawImage(characterE, me.x, me.y);
			break;
		case characterDirection.SE:
			if(me.walkAnimation == 1)ctx.drawImage(characterSE1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterSE2, me.x, me.y);
			else ctx.drawImage(characterSE, me.x, me.y);
			break;
		case characterDirection.S:
			if(me.walkAnimation == 1)ctx.drawImage(characterS1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterS2, me.x, me.y);
			else ctx.drawImage(characterS, me.x, me.y);
			break;
		case characterDirection.SW:
			if(me.walkAnimation == 1)ctx.drawImage(characterSW1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterSW2, me.x, me.y);
			else ctx.drawImage(characterSW, me.x, me.y);
			break;
		case characterDirection.W:
			if(me.walkAnimation == 1)ctx.drawImage(characterW1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterW2, me.x, me.y);
			else ctx.drawImage(characterW, me.x, me.y);
			break;
		case characterDirection.NW:
			if(me.walkAnimation == 1)ctx.drawImage(characterNW1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(characterNW2, me.x, me.y);
			else ctx.drawImage(characterNW, me.x, me.y);
			break;
		default:
			break;
	}
}

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