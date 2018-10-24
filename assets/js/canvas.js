var LEFTMARGIN = 5;
var RIGHTMARGIN = 10;
var DEFAULTSPEED = 300;
var CAMERASPEED = 600;
var ROADWIDTH = 300;
var TITLE = "Lim Wei Cheng";
var SUBTITLE = "Just another rather average being";

var fences = [];
var roads = [];
var trees = [];
var treeCoordinates = [];
var houses = [];

var mainLoopRunning = false;
var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mapWidth = Math.max(1500, canvas.width);
var mapHeight = Math.max(2500, canvas.height);
var ctx = canvas.getContext('2d');


function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX) - rect.left - me.width/2,
		y: (evt.clientY) - rect.top - me.height
	};
}

/*For mouse click based movements*/
var mouseInt;
var mouseDown = false;
canvas.addEventListener('mousedown', function(evt) {
	if (leftMousePressed(evt)){
		me.speed = DEFAULTSPEED;
		me.walkingTimer = DEFAULTSPEED;
		mouseInt = setInterval(function(){ 
			var mousePos = getMousePos(canvas, evt);
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
			walkTo(me, mousePos.x - camX, mousePos.y - camY); }, 0);
			mouseDown = true;
	}
}, false);
canvas.addEventListener('mousemove', function(evt) {
	if(mouseDown){ 
		clearInterval(mouseInt);
		mouseInt = setInterval(function(){ 
			var mousePos = getMousePos(canvas, evt);
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
			walkTo(me, mousePos.x - camX, mousePos.y - camY); }, 0);
		}
}, false);
canvas.addEventListener('mouseup', function(evt) {
	clearInterval(mouseInt);
	mouseDown = false;
}, false);

function leftMousePressed(e)
{
    e = e || window.event;
    var button = e.which || e.button;
    return button == 1;
}
/*End of mouse click based movements*/

var images = {};
var imageSources = {
	//Terrain images
	bgImage: 			"assets/images/sprites/terrain/forest_tiles.png",
	roadImage: 			"assets/images/sprites/terrain/road.png",
	fenceImageVer: 		"assets/images/sprites/terrain/fence_ver.png",
	fenceImageHor: 		"assets/images/sprites/terrain/fence_hor.png",
	treeImage1: 		"assets/images/sprites/terrain/tree1.png",
	treeImage2: 		"assets/images/sprites/terrain/tree2.png",
	treeImage3: 		"assets/images/sprites/terrain/tree3.png",
	bigTreeImage: 		"assets/images/sprites/terrain/bigtree.png",

	//House
	housedoor: 			"assets/images/sprites/house/door.png",
	housefloor:			"assets/images/sprites/house/housefloor.png",
	houseroof: 			"assets/images/sprites/house/houseroof.png",

	//Character Images
	characterS: 		"assets/images/sprites/characters/meS.png",
	characterS1: 		"assets/images/sprites/characters/meS1.png",
	characterS2: 		"assets/images/sprites/characters/meS2.png",
	characterN: 		"assets/images/sprites/characters/meN.png",
	characterN1: 		"assets/images/sprites/characters/meN1.png",
	characterN2: 		"assets/images/sprites/characters/meN2.png",
	characterE: 		"assets/images/sprites/characters/meE.png",
	characterE1: 		"assets/images/sprites/characters/meE1.png",
	characterE2: 		"assets/images/sprites/characters/meE2.png",
	characterW: 		"assets/images/sprites/characters/meW.png",
	characterW1: 		"assets/images/sprites/characters/meW1.png",
	characterW2: 		"assets/images/sprites/characters/meW2.png",
	characterSW: 		"assets/images/sprites/characters/meSW.png",
	characterSW1: 		"assets/images/sprites/characters/meSW1.png",
	characterSW2: 		"assets/images/sprites/characters/meSW2.png",
	characterNW: 		"assets/images/sprites/characters/meNW.png",
	characterNW1: 		"assets/images/sprites/characters/meNW1.png",
	characterNW2: 		"assets/images/sprites/characters/meNW2.png",
	characterSE: 		"assets/images/sprites/characters/meSE.png",
	characterSE1: 		"assets/images/sprites/characters/meSE1.png",
	characterSE2: 		"assets/images/sprites/characters/meSE2.png",
	characterNE: 		"assets/images/sprites/characters/meNE.png",
	characterNE1: 		"assets/images/sprites/characters/meNE1.png",
	characterNE2:  		"assets/images/sprites/characters/meNE2.png"
};

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
	speed: DEFAULTSPEED*0.2, // movement in pixels per second
	walkingTimer: DEFAULTSPEED*0.2,
	walkAnimation: 0,
	direction: characterDirection.N,
	width: 0,
	height: 0,
	x: mapWidth/2,
	y: mapHeight+100,
	prevX:0,
	prevY:0,
	autoWalk: true,
	autoWalkX: mapWidth/2,
	autoWalkY: mapHeight-170
};

window.onresize = function(event) {
	if (mainLoopRunning){
		init();
	}else{
		init(main);
	}
    render();
};

//image preloader
function loadImages(imgSrc, callback, nextCallback){
	var loadedImg = 0;
	var numImg = Object.keys(imgSrc).length;
	for (var src in imgSrc){
		images[src] = new Image();
		images[src].onload = function(){
			if(++loadedImg >= numImg){
				callback(nextCallback);
			}
		};
		images[src].src = imgSrc[src];
	}
}

function load_character(){
	me.width = images.characterS.naturalWidth;
	me.height = images.characterS.naturalHeight;
}

function load_roads_fences(){
	fences = [], roads = [], treeCoordinates = [];
	var mainRoad;

	//please input in the following format [roadType, x coor, y coor, width, length]
	//roadType: 0 for main road, 1 for left side road, 2 for right side road
	var roadsDetails = [[1,0,mapHeight-ROADWIDTH - 900, mapWidth/2-0.75*ROADWIDTH, ROADWIDTH],
					[0, mapWidth/2-1.5*ROADWIDTH/2,0, 1.5*ROADWIDTH, mapHeight],
					[2, mapWidth/2+0.75*ROADWIDTH,mapHeight-ROADWIDTH-300, mapWidth/2, ROADWIDTH],
					[1, 0,mapHeight-ROADWIDTH - 150, mapWidth/2-0.75*ROADWIDTH, ROADWIDTH]];

	for (var i in roadsDetails){
		roads.push(new road(roadsDetails[i]));
	}
	roads.sort(compareRoads);
	mainRoad = roads[0];

	for (var i=0, startYLeft=mapHeight, startYRight=mapHeight, currRoad; i<roads.length; i++){ //to create fences for all roads
		if(roads[i].type==roadType.main) continue;
		currRoad = roads[i];
		if(currRoad.type==roadType.sideLeft){
			fences.push(new fence(0, currRoad.x, currRoad.y-images.fenceImageHor.naturalHeight+2, currRoad.width-images.fenceImageVer.naturalWidth, currRoad));
			fences.push(new fence(0, currRoad.x, currRoad.y2, currRoad.width-images.fenceImageVer.naturalWidth, currRoad));
			fences.push(new fence(1, mapWidth/2-1.5*ROADWIDTH/2-images.fenceImageVer.naturalWidth, currRoad.y2, startYLeft-currRoad.y2, mainRoad));
			startYLeft = currRoad.y;
			if (currRoad.isLastOne()){
				fences.push(new fence(1,  mapWidth/2-1.5*ROADWIDTH/2-images.fenceImageVer.naturalWidth, 0, startYLeft, mainRoad));
			}
		}else{
			fences.push(new fence(2, currRoad.x+images.fenceImageVer.naturalWidth, currRoad.y-images.fenceImageHor.naturalHeight+2, currRoad.width, currRoad));
			fences.push(new fence(2, currRoad.x+images.fenceImageVer.naturalWidth, currRoad.y2, currRoad.width-images.fenceImageVer.naturalWidth, currRoad));
			fences.push(new fence(1, mapWidth/2+1.5*ROADWIDTH/2, currRoad.y2, startYRight-currRoad.y2, mainRoad));
			startYRight = currRoad.y;
			if (currRoad.isLastOne()){
				fences.push(new fence(1,  mapWidth/2+1.5*ROADWIDTH/2, 0, startYRight, mainRoad));
			}
		}
		
	}
}

function load_houses(){
	houses = [];
	var houseDetails = [[20,mapHeight-ROADWIDTH - 150 - 100, images.houseroof.naturalWidth, images.houseroof.naturalHeight, "aboutme", "About Me"],
					[20 + images.houseroof.naturalWidth + 40,mapHeight-ROADWIDTH - 150 - 100, images.houseroof.naturalWidth, images.houseroof.naturalHeight, 'cv', "CV/Resume"],
					[mapWidth-images.houseroof.naturalWidth-20-images.houseroof.naturalWidth - 40, mapHeight-ROADWIDTH-300-100, images.houseroof.naturalWidth, images.houseroof.naturalHeight, 'skills', "Skills"],
					[mapWidth-images.houseroof.naturalWidth-20, mapHeight-ROADWIDTH-300-100, images.houseroof.naturalWidth, images.houseroof.naturalHeight, 'contact', "Contact Me"]];

	for (var i in houseDetails){
		houses.push(new house(houseDetails[i]));
	}
}

function load_trees(){
	var randominzer=0;
	trees = [];
	var mainRoad = roads[0];
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

	for (var i=0; i<treeCoordinates.length; i++){
		randominzer = Math.floor(Math.random()*3)+1;
		trees.push(new tree(randominzer, treeCoordinates[i][0], treeCoordinates[i][1]));
	}
}

var init = function (callback) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	mapWidth = Math.max(1500, canvas.width);
	mapHeight = Math.max(2500, canvas.height);
	if(!onMainRoad(me, roads)){
		me.x = me.x*(window.innerWidth/canvas.width); //scale character's position on side roads according to map size
	}else{
		me.x += mapWidth/2-1.5*ROADWIDTH/2 - roads[0].x;  //to make character stay on same position on main road
	}
	load_character();
	load_roads_fences();
	load_houses();
	load_trees();
	for (var i in houses){
		if (houses[i].crash(me)){
			me.x = mapWidth/2;
			me.y = mapHeight-100;
		}
	}
	canvasRdy = true;
	if(callback!=undefined){
		mainLoopRunning = true;
		callback();
	}
};

var keysDown = {};

function keyDownListener(e) {if (me.autoWalk){keysDown={};me.autoWalk=false;}keysDown[e.keyCode] = true;me.speed = DEFAULTSPEED;me.walkingTimer = DEFAULTSPEED;}
function keyUpListener(e) {delete keysDown[e.keyCode];}
enableMouse();
$(window).blur(function() { //to prevent abuse of walking through fences
	keysDown = {};
});

function enableMouse(){
	addEventListener("keydown", keyDownListener, false);
	addEventListener("keyup", keyUpListener, false);
}

function disableMouse(){
	removeEventListener("keydown", keyDownListener, false);
	removeEventListener("keyup", keyUpListener, false);
	keysDown = {};
}

var update = function (modifier) {
	me.prevX = me.x;
	me.prevY = me.y;
	if (me.autoWalk){
		keysDown = {};
		if (me.x > me.autoWalkX + 5){
			keysDown[37] = true;
		}else if (me.x < me.autoWalkX - 5){
			keysDown[39] = true;
		}else {
			me.x = me.autoWalkX;
		}
		if (me.y > me.autoWalkY + 5){
			keysDown[38] = true;
		}else if (me.y < me.autoWalkY - 5){
			keysDown[40] = true;
		}else {
			me.y = me.autoWalkY;
		}
		if (me.x == me.autoWalkX && me.y == me.autoWalkY){
			me.autoWalk = false;
			keysDown = {};
			me.speed = DEFAULTSPEED;
			me.walkingTimer = DEFAULTSPEED;
		}
	}
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
		checkDoors();
		checkCollision();
		if(!onRoads(me)){
			me.x = me.prevX;
			me.y = me.prevY;
		}
	    setCameraViewPort(modifier);
	}
};

function onMainRoad(character, roads){
	for (var i in roads){
		if (roads[i].type==roadType.main){
			if(character.x >= roads[i].x && (character.x + character.width) <= roads[i].x2){
				return true;
			}
			break;
		}
	}
	return false;
}

function onRoads(character){
	for (var i in roads){
		if (character.x >= roads[i].x && (character.x + character.width) <= roads[i].x2
			&& (character.y + character.height/2) >= roads[i].y && (character.y + character.height) <= roads[i].y2){
			return true;
		}else if (roads[i].type == roadType.sideLeft && (character.x <= roads[i].x2)
			&& (character.y + character.height/2) >= roads[i].y && (character.y + character.height) <= roads[i].y2){
			return true;
		}else if (roads[i].type == roadType.sideRight && ((character.x + character.width) >= roads[i].x)
			&& (character.y + character.height/2) >= roads[i].y && (character.y + character.height) <= roads[i].y2){
			return true;
		}
	}
	return false;
}

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
    if (houses != null){
    	for (var i=0, collisionIndex; i<houses.length; i++){
	    	collisionIndex = houses[i].collide(me);
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

function checkDoors(){
    if (houses != null){
    	for (var i=0; i<houses.length; i++){
    		if(houses[i].atDoor(me)){
    			houses[i].openDoor();
    		}else{
    			houses[i].closeDoor();
    		}
	    }
    }
    
}

var currCamX = 0;
var currCamY = 0;
var panning = false;
function setCameraViewPort(modifier){
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

    if (panning){
    	if (currCamX < camX - 9){
	    	currCamX += CAMERASPEED * modifier;
	    }else if (currCamX > camX + 9){
	    	currCamX -= CAMERASPEED * modifier;
	    }else{
	    	currCamX = camX;
	    }
	    if (currCamY < camY - 9){
	    	currCamY += CAMERASPEED * modifier;
	    }else if (currCamY > camY + 9){
	    	currCamY -= CAMERASPEED * modifier;
	    }else{
	    	currCamY = camY;
	    }
	    ctx.translate( currCamX, currCamY );
    }else {
    	currCamX = camX;
    	currCamY = camY;
    	ctx.translate( camX, camY );
    }
	    
}

var render = function () {
	drawTerrain();
	drawTextOnGrass();
	drawRoads();
	drawTextOnRoads();
	drawHouseFloor();
	drawCharacter();
	drawTrees();
	drawHouseRoof();
};

var drawTerrain = function(){
	var pat=ctx.createPattern(images.bgImage,"repeat");
	ctx.rect(0,0, mapWidth, mapHeight);
	ctx.fillStyle=pat;
	ctx.fill();
}

var drawRoads = function(){
	var pat=ctx.createPattern(images.roadImage,"repeat");
	var fenceX, fenceY, flength;
	ctx.fillStyle=pat;

	for (var i=0; i<fences.length; i++){
		ctx.save();
		if (fences[i].type==1){
			pat=ctx.createPattern(images.fenceImageVer,"repeat-y");
			ctx.fillStyle=pat;
			fenceX = fences[i].x;
			fenceY = fences[i].y;
			flength = fences[i].length;
			ctx.translate(fenceX , fenceY)
			ctx.fillRect(0,0, images.fenceImageVer.naturalWidth, flength);
		}
		ctx.restore();
	}
	for (var i=0; i<roads.length; i++){
		ctx.fillRect(roads[i].x,roads[i].y, roads[i].width, roads[i].length);
	}
	for (var i=0; i<fences.length; i++){
		ctx.save();
		if (fences[i].type==2){
			pat=ctx.createPattern(images.fenceImageHor,"repeat-x");
			ctx.fillStyle=pat;
			fenceX = fences[i].x;
			fenceY = fences[i].y;
			flength = fences[i].length;
			ctx.translate(fenceX , fenceY)
			ctx.fillRect(0,0, flength, images.fenceImageHor.naturalHeight);
		} else if (fences[i].type==0){
			pat=ctx.createPattern(images.fenceImageHor,"repeat-x");
			ctx.fillStyle=pat;
			fenceX = -fences[i].x+fences[i].length;
			fenceY = fences[i].y;
			flength = -fences[i].length;
			ctx.translate(fenceX , fenceY)
		ctx.fillRect(0,0, flength, images.fenceImageHor.naturalHeight);
		}
		ctx.restore();
	}
}

var drawTextOnGrass = function(){
	var fontSize = Math.max(16,Math.min(canvas.width/64, 30));
	ctx.font = fontSize + "px PressStart";
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillText(TITLE, mapWidth/2-ROADWIDTH*0.75-15-ctx.measureText(TITLE).width, mapHeight-80);
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillText(TITLE, mapWidth/2-ROADWIDTH*0.75-15-ctx.measureText(TITLE).width+1, mapHeight-81);
	ctx.fillStyle = "#51AD88";
	ctx.fillText(TITLE,mapWidth/2-ROADWIDTH*0.75-15-ctx.measureText(TITLE).width+1,mapHeight-83);	
	ctx.font = fontSize + "px CodersCrux";
	ctx.fillStyle = "rgba(0,0,0,0.6)";
	ctx.fillText(SUBTITLE, mapWidth/2-ROADWIDTH*0.75-15-ctx.measureText(SUBTITLE).width, mapHeight-83+ fontSize);

	ctx.save();
	ctx.font = fontSize + "px CodersCrux";
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillText("Instructions", (mapWidth/2)+(ROADWIDTH*0.75+14), mapHeight-220);
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillText("Instructions", (mapWidth/2)+(ROADWIDTH*0.75+15), mapHeight-221);
	ctx.fillStyle = "rgba(96,96,96,1)";
	ctx.fillText("Instructions", (mapWidth/2)+(ROADWIDTH*0.75+15), mapHeight-222);
	ctx.restore();

	ctx.fillText("Use arrows keys to navigate", (mapWidth/2)+(ROADWIDTH*0.75+15+3.3*fontSize), mapHeight-222 + 2*fontSize);
	ctx.save();
	ctx.font = fontSize + "px WebSymbols";
	ctx.fillText("(;)", (mapWidth/2)+(ROADWIDTH*0.75+15), mapHeight-222 + 2*fontSize);
	ctx.fillText(":", (mapWidth/2)+(ROADWIDTH*0.75+15+fontSize), mapHeight-223 + fontSize);
	ctx.restore();

	ctx.fillText("Enter houses to view different tabs", (mapWidth/2)+(ROADWIDTH*0.75+15+3.3*fontSize), mapHeight-222 + 3.5*fontSize);
	ctx.save();
	ctx.font = fontSize + "px WebSymbols";
	ctx.fillText("n", (mapWidth/2)+(ROADWIDTH*0.75+15+fontSize*0.9), mapHeight-222 + 3.5*fontSize);
	ctx.restore();

	ctx.fillText("Press Esc to close tabs", (mapWidth/2)+(ROADWIDTH*0.75+15+3.3*fontSize), mapHeight-222 + 5*fontSize);
	ctx.save();
	ctx.font = fontSize + "px WebSymbols";
	ctx.fillText("h", (mapWidth/2)+(ROADWIDTH*0.75+15+fontSize*0.9), mapHeight-222 + 5*fontSize);
	ctx.restore();
}

var drawTextOnRoads = function(){
	ctx.font = "48px PressStart";
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillText("DEAD END", mapWidth/2-1.5*ROADWIDTH/2+30, 132);
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillText("DEAD END", mapWidth/2-1.5*ROADWIDTH/2+29, 129);
	ctx.fillStyle = "#9CA2A8";
	ctx.fillText("DEAD END",mapWidth/2-1.5*ROADWIDTH/2+30,130);
}

var drawTrees = function(){
	var fontSize = Math.max(16,Math.min(canvas.width/64, 30));
	ctx.font = fontSize + "px PressStart";
	ctx.drawImage(images.bigTreeImage, mapWidth/2-ROADWIDTH*0.75-ctx.measureText(TITLE).width-100, mapHeight-200);
	for (var i=0; i<trees.length; i++){
		ctx.drawImage(eval("images.treeImage" + trees[i].type), trees[i].x, trees[i].y);
	}
}

var drawHouseFloor = function(){
	for (var i=0; i<houses.length; i++){
		ctx.drawImage(images.housefloor, houses[i].x, houses[i].y+61);
		if (houses[i].doorClosed){
			ctx.drawImage(images.housedoor, houses[i].x+houses[i].doorX, houses[i].y+houses[i].doorY);
		}
	}
}

var drawHouseRoof = function(){
	for (var i=0; i<roads.length; i++){
		ctx.drawImage(images.houseroof, houses[i].x, houses[i].y);
		ctx.save();
		ctx.font = "25px CodersCrux";
		ctx.fillStyle = "rgba(0,0,0,0.3)";
		ctx.fillText(houses[i].banner, (houses[i].x+houses[i].x2)/2-5*houses[i].banner.length+1, houses[i].y+100+2);
		ctx.fillStyle = "rgba(255,255,255,1)";
		ctx.fillText(houses[i].banner, (houses[i].x+houses[i].x2)/2-5*houses[i].banner.length, houses[i].y+98);
		ctx.fillStyle = "rgba(96,96,96,1)";
		ctx.fillText(houses[i].banner, (houses[i].x+houses[i].x2)/2-5*houses[i].banner.length, houses[i].y+100);
		ctx.restore();
	}
}

var walkTo = function(character, x, y) {
	character.autoWalk = true;
	character.autoWalkX = x;
	character.autoWalkY = y;
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
			if(me.walkAnimation == 1)ctx.drawImage(images.characterN1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterN2, me.x, me.y);
			else ctx.drawImage(images.characterN, me.x, me.y);
			break;
		case characterDirection.NE:
			if(me.walkAnimation == 1)ctx.drawImage(images.characterNE1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterNE2, me.x, me.y);
			else ctx.drawImage(images.characterNE, me.x, me.y);
			break;
		case characterDirection.E:
			if(me.walkAnimation == 1)ctx.drawImage(images.characterE1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterE2, me.x, me.y);
			else ctx.drawImage(images.characterE, me.x, me.y);
			break;
		case characterDirection.SE:
			if(me.walkAnimation == 1)ctx.drawImage(images.characterSE1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterSE2, me.x, me.y);
			else ctx.drawImage(images.characterSE, me.x, me.y);
			break;
		case characterDirection.S:
			if(me.walkAnimation == 1)ctx.drawImage(images.characterS1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterS2, me.x, me.y);
			else ctx.drawImage(images.characterS, me.x, me.y);
			break;
		case characterDirection.SW:
			if(me.walkAnimation == 1)ctx.drawImage(images.characterSW1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterSW2, me.x, me.y);
			else ctx.drawImage(images.characterSW, me.x, me.y);
			break;
		case characterDirection.W:
			if(me.walkAnimation == 1)ctx.drawImage(images.characterW1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterW2, me.x, me.y);
			else ctx.drawImage(images.characterW, me.x, me.y);
			break;
		case characterDirection.NW:
			if(me.walkAnimation == 1)ctx.drawImage(images.characterNW1, me.x, me.y);
			else if(me.walkAnimation == 3)ctx.drawImage(images.characterNW2, me.x, me.y);
			else ctx.drawImage(images.characterNW, me.x, me.y);
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
	/*if (window.innerWidth < 672){
		mainLoopRunning = false;
	}*/
	if (mainLoopRunning){
		requestAnimationFrame(main);
	}else{
		mainLoopRunning = false;
	}
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
loadImages(imageSources, init, main); //preload images before initializing other stuff, then finally call main function