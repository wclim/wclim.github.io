var LEFTMARGIN = 5;
var RIGHTMARGIN = 10;
var DEFAULTSPEED = 700;
var TITLE = "This is a test site"; //Lim Wei Cheng
var SUBTITLE = "This is also a test"; //Just another rather average being

var fences = [];
var roads = [];
var trees = [];
var treeCoordinates = [];

var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mapWidth = canvas.width*1.1;
var mapHeight = Math.max(2500, canvas.height);
var ctx = canvas.getContext('2d');
var bgReady = false;
var bgImage = new Image();
var roadImage = new Image();
var fenceImageVer = new Image(),fenceImageHor = new Image();
var treeImage1 = new Image(), treeImage2 = new Image(), treeImage3 = new Image(), bigTreeImage = new Image();
var characterReady = false;
var characterS = new Image(), characterS1 = new Image(), characterS2 = new Image();
var characterN = new Image(), characterN1 = new Image(), characterN2 = new Image();
var characterE = new Image(), characterE1 = new Image(), characterE2 = new Image();
var characterW = new Image(), characterW1 = new Image(), characterW2 = new Image();
var characterSW = new Image(), characterSW1 = new Image(), characterSW2 = new Image();
var characterNW = new Image(), characterNW1 = new Image(), characterNW2 = new Image();
var characterSE = new Image(), characterSE1 = new Image(), characterSE2 = new Image();
var characterNE = new Image(), characterNE1 = new Image(), characterNE2 = new Image();

var characterDirection = {
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
	speed: DEFAULTSPEED, // movement in pixels per second
	walkingTimer: DEFAULTSPEED,
	walkAnimation: 0,
	direction: characterDirection.S,
	width: 0,
	height: 0,
	x: 0,
	y: mapHeight-100,
	prevX:0,
	prevY:0
};

window.onresize = function(event) {
    resize_canvas();
    render();
};

function resize_canvas(){
    canvas.width  = window.innerWidth;
    mapWidth = canvas.width*1.1;
    canvas.height = window.innerHeight;
    init();
}

function load_terrain(){
	bgImage.onload = function () {
		bgReady = true;
	};
	bgImage.src = "assets/images/sprites/terrain/forest_tiles.png";
	roadImage.src = "assets/images/sprites/terrain/road.png";
	fenceImageHor.src = "assets/images/sprites/terrain/fence_hor.png", fenceImageVer.src = "assets/images/sprites/terrain/fence_ver.png";
	treeImage1.src = "assets/images/sprites/terrain/tree1.png", treeImage2.src = "assets/images/sprites/terrain/tree2.png", treeImage3.src = "assets/images/sprites/terrain/tree3.png", bigTreeImage.src = "assets/images/sprites/terrain/bigtree.png";
}
function load_character(){
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

function load_roads_fences(){
	fences = [], roads = [], treeCoordinates = [];
	var mainRoad = new road(0, mapWidth/2-1.5*ROADWIDTH/2,0, 1.5*ROADWIDTH, mapHeight);
	
	roads.push(mainRoad);
	//build left side roads from bottom to top
	roads.push(new road(1, 0,mapHeight-ROADWIDTH - 150, mapWidth/2-0.75*ROADWIDTH, ROADWIDTH));
	roads.push(new road(1, 0,mapHeight-ROADWIDTH - 900, mapWidth/2-0.75*ROADWIDTH, ROADWIDTH));
	//build right side roads from bottom to top
	roads.push(new road(2, mapWidth/2+0.75*ROADWIDTH,mapHeight-ROADWIDTH-300, mapWidth/2, ROADWIDTH));

	//plant trees from top to bottom
	treeCoordinates.push([mainRoad.x-75, 100]);
	treeCoordinates.push([mainRoad.x-175, 700]);
	treeCoordinates.push([mainRoad.x-150, 1000]);
	treeCoordinates.push([mainRoad.x-475, 450]);
	treeCoordinates.push([mainRoad.x-575, 600]);
	treeCoordinates.push([mainRoad.x-770, 777]);
	treeCoordinates.push([mainRoad.x-840, mapHeight - 900]);
	treeCoordinates.push([mainRoad.x-510, mapHeight - 840]);
	treeCoordinates.push([mainRoad.x-500, mapHeight - 810]);
	treeCoordinates.push([mainRoad.x-740, mapHeight - 700]);
	treeCoordinates.push([mainRoad.x-120, mapHeight - 530]);
	treeCoordinates.push([mainRoad.x-45, mapHeight - 50]);
	treeCoordinates.push([mainRoad.x-320, mapHeight - 20]);

	treeCoordinates.push([mainRoad.x2+320, 50]);
	treeCoordinates.push([mainRoad.x2+270, 300]);
	treeCoordinates.push([mainRoad.x2+550, 400]);
	treeCoordinates.push([mainRoad.x2+170, 600]);
	treeCoordinates.push([mainRoad.x2+400, 1000]);
	treeCoordinates.push([mainRoad.x2+800, 1150]);
	treeCoordinates.push([mainRoad.x2+70, 1450]);
	treeCoordinates.push([mainRoad.x2+500, 1750]);
	treeCoordinates.push([mainRoad.x2+77, 1700]);
	treeCoordinates.push([mainRoad.x2+370, mapHeight - 307]);
	treeCoordinates.push([mainRoad.x2+320, mapHeight - 307]);
	treeCoordinates.push([mainRoad.x2+270, mapHeight - 307]);
	treeCoordinates.push([mainRoad.x2+220, mapHeight - 307]);
	treeCoordinates.push([mainRoad.x2+170, mapHeight - 307]);
	treeCoordinates.push([mainRoad.x2+120, mapHeight - 307]);
	treeCoordinates.push([mainRoad.x2+70, mapHeight - 307]);
	treeCoordinates.push([mainRoad.x2+320, mapHeight - 30]);

	for (var i=0, startYLeft=mapHeight, startYRight=mapHeight, currRoad; i<roads.length; i++){ //to create fences for all roads
		if(roads[i].type==0) continue;
		currRoad = roads[i];
		if(currRoad.type==1){
			fences.push(new fence(0, "bottom", currRoad.x, currRoad.y-fenceImageHor.naturalHeight+2, currRoad.width-fenceImageVer.naturalWidth, currRoad));
			fences.push(new fence(0, "top", currRoad.x, currRoad.y2, currRoad.width-fenceImageVer.naturalWidth, currRoad));
			fences.push(new fence(1, "right", mapWidth/2-1.5*ROADWIDTH/2-fenceImageVer.naturalWidth, currRoad.y2, startYLeft-currRoad.y2, mainRoad));
			startYLeft = currRoad.y;
			if (currRoad.isLastOne()){
				fences.push(new fence(1, "right",  mapWidth/2-1.5*ROADWIDTH/2-fenceImageVer.naturalWidth, 0, startYLeft, mainRoad));
			}
		}else{
			fences.push(new fence(2, "bottom", currRoad.x+fenceImageVer.naturalWidth, currRoad.y-fenceImageHor.naturalHeight+2, currRoad.width, currRoad));
			fences.push(new fence(2, "top", currRoad.x+fenceImageVer.naturalWidth, currRoad.y2, currRoad.width-fenceImageVer.naturalWidth, currRoad));
			fences.push(new fence(1, "left", mapWidth/2+1.5*ROADWIDTH/2, currRoad.y2, startYRight-currRoad.y2, mainRoad));
			startYRight = currRoad.y;
			if (currRoad.isLastOne()){
				fences.push(new fence(1, "left",  mapWidth/2+1.5*ROADWIDTH/2, 0, startYRight, mainRoad));
			}
		}
		
	}
}

function load_trees(){
	var randominzer=0;
	trees = [];

	for (var i=0; i<treeCoordinates.length; i++){
		randominzer = Math.floor(Math.random()*3)+1;
		trees.push(new tree(randominzer, treeCoordinates[i][0], treeCoordinates[i][1]));
	}
}

var init = function () {
	me.x = mapWidth/2;
	load_terrain();
	load_character();
	fenceImageHor.onload = function (){
		fenceImageVer.onload = function (){
			load_roads_fences();
		}
	}
	treeImage1.onload = function (){
		load_trees();
	}
};

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var update = function (modifier) {
	me.prevX = me.x;
	me.prevY = me.y;
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

		checkCollision();

	    setCameraViewPort();
	}
};

function checkCollision(){
	if (me.x < LEFTMARGIN) me.x = LEFTMARGIN;
    if (me.y < RIGHTMARGIN) me.y = RIGHTMARGIN;
    if (me.x > mapWidth-LEFTMARGIN-me.width) me.x = mapWidth-LEFTMARGIN-me.width;
    if (me.y > mapHeight-RIGHTMARGIN-me.height) me.y = mapHeight-RIGHTMARGIN-me.height;
    if (fences != null){
    	for (var i=0, collisionIndex; i<fences.length; i++){
    		collisionIndex = fences[i].collide(me);
	    	if (collisionIndex == 1){
	    		me.x = me.prevX;
	    		break;
	    	} else if (collisionIndex == 2){
	    		me.y = me.prevY;
	    		break;
	    	}
	    }
    }
    
}

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
		drawTerrain();
		drawText();
		drawRoads();
		drawTextOnRoads();
	}
	if (characterReady) {
		drawCharacter();
	}
	drawTrees();
};

var drawTerrain = function(){
	var pat=ctx.createPattern(bgImage,"repeat");
	ctx.rect(0,0, mapWidth, mapHeight);
	ctx.fillStyle=pat;
	ctx.fill();
}

var drawRoads = function(){
	var pat=ctx.createPattern(roadImage,"repeat");
	var fenceX, fenceY, flength;
	ctx.fillStyle=pat;

	for (var i=0; i<fences.length; i++){
		ctx.save();
		if (fences[i].type==1){
			pat=ctx.createPattern(fenceImageVer,"repeat-y");
			ctx.fillStyle=pat;
			fenceX = fences[i].x;
			fenceY = fences[i].y;
			flength = fences[i].length;
			ctx.translate(fenceX , fenceY)
			ctx.fillRect(0,0, fenceImageVer.naturalWidth, flength);
		}
		ctx.restore();
	}
	for (var i=0; i<roads.length; i++){
		ctx.fillRect(roads[i].x,roads[i].y, roads[i].width, roads[i].length);
	}
	for (var i=0; i<fences.length; i++){
		ctx.save();
		if (fences[i].type==2){
			pat=ctx.createPattern(fenceImageHor,"repeat-x");
			ctx.fillStyle=pat;
			fenceX = fences[i].x;
			fenceY = fences[i].y;
			flength = fences[i].length;
			ctx.translate(fenceX , fenceY)
			ctx.fillRect(0,0, flength, fenceImageHor.naturalHeight);
		} else if (fences[i].type==0){
			pat=ctx.createPattern(fenceImageHor,"repeat-x");
			ctx.fillStyle=pat;
			fenceX = -fences[i].x+fences[i].length;
			fenceY = fences[i].y;
			flength = -fences[i].length;
			ctx.translate(fenceX , fenceY)
		ctx.fillRect(0,0, flength, fenceImageHor.naturalHeight);
		}
		ctx.restore();
	}
}

var drawText = function(){
	ctx.font = canvas.width/64 + "px PressStart";
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillText(TITLE, mapWidth/2-canvas.width/2+29, mapHeight-80);
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillText(TITLE, mapWidth/2-canvas.width/2+30, mapHeight-81);
	ctx.fillStyle = "#51AD88";
	ctx.fillText(TITLE,mapWidth/2-canvas.width/2+30,mapHeight-83);	
	ctx.font = canvas.width/64 + "px CodersCrux";
	ctx.fillStyle = "rgba(0,0,0,0.6)";
	ctx.fillText(SUBTITLE, mapWidth/2-canvas.width/2+35, mapHeight-50);
}

var drawTextOnRoads = function(){
	ctx.font = "48px PressStart";
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillText("DEAD END", mapWidth/2-1.5*ROADWIDTH/2+30, 182);
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillText("DEAD END", mapWidth/2-1.5*ROADWIDTH/2+29, 179);
	ctx.fillStyle = "#9CA2A8";
	ctx.fillText("DEAD END",mapWidth/2-1.5*ROADWIDTH/2+30,180);
}

var drawTrees = function(){
	if(canvas.width>488){
		ctx.drawImage(bigTreeImage, mapWidth/2-canvas.width/2-55, mapHeight-200);
	}else{
		ctx.drawImage(bigTreeImage, mapWidth/2-1.5*ROADWIDTH/2-75, mapHeight-200);
	}
	for (var i=0; i<trees.length; i++){
		ctx.drawImage(eval("treeImage" + trees[i].type), trees[i].x, trees[i].y);
	}
}

var drawCharacter = function(){
	// Draw shadow start
	ctx.save();
	ctx.beginPath();
	ctx.scale(2, 1);
	ctx.arc(me.x/2+me.width/4, me.y+me.height, 7, 0, 2 * Math.PI, false);
	ctx.fillStyle = "rgba(0,0,0,0.1)";
	ctx.fill();
	ctx.beginPath();
	ctx.arc(me.x/2+me.width/4, me.y+me.height, 4.5, 0, 2 * Math.PI, false);
	ctx.fillStyle = "rgba(0,0,0,0.2)";
	ctx.fill();
	ctx.restore();
	// Draw shadow end
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
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame     ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.msRequestAnimationFrame      ||
        function( callback ) { return window.setTimeout( callback, 0); };
})();

window.cancelAnimationFrame = (function() {
    return window.cancelAnimationFrame      ||
        window.webkitCancelAnimationFrame   ||
        window.mozCancelAnimationFrame      ||
        window.msCancelAnimationFrame       ||
        function( intervalKey ) { window.clearTimeout( intervalKey ); };
})();

var then = Date.now();
init();
main();