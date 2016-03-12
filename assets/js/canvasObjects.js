var roadType = {
	main: 0,
	sideLeft: 1,
	sideRight: 2
}

var fence = function (type, x, y, length, parent) {
	this.type = type; //0 for horizontal on left of main road, 1 for vertical, 2 for horizontal on right of main road
	this.length = length;
	this.x = x;
	this.y = y;
	this.parentRoad = parent;
};

var road = function (data) {
	this.type = data[0];
	this.length = data[4];
	this.width = data[3];
	this.x = data[1];
	this.y = data[2];
	this.x2 = this.x + this.width;
	this.y2 = this.y + this.length;
};

var tree = function (type, x, y){
	this.type = type;
	this.x = x;
	this.y = y;
}

var house = function(data){
	this.x = data[0];
	this.y = data[1];
	this.x2 = this.x + data[2];
	this.y2 = this.y + data[3];
	this.tab = data[4];
	this.banner = data[5];
	this.doorClosed = true;
	this.doorX = 26;
	this.doorY = 122;
	this.doorX2 = this.doorX + 35;
	this.doorY2 = this.doorY + 35;
}

fence.prototype.collide = function(character) { //returns 0 for no collision, returns 1 for vertical fence collision, returns 2 for horizontal fence collision
	if (this.type == 0 || this.type == 2){
		if (this.collideFromSide(character)){
			return 1;
		}
		if ((character.x) < this.x + this.length + images.fenceImageVer.naturalWidth
			&& (character.x+character.width) > this.x - images.fenceImageVer.naturalWidth
			&& (character.y + character.height/1.6) < this.y + images.fenceImageHor.naturalHeight 
			&& (character.y + character.height) > this.y){
			return 2;
		}
	} else if(this.type == 1){
		if ((character.x) < this.x + images.fenceImageVer.naturalWidth
			&& (character.x+character.width) > this.x
			&& (character.y + character.height/1.6) < this.y + this.length
			&& (character.y + character.height) > this.y){
			return 1;
		}
	}
	return 0;
};

fence.prototype.collideFromSide = function(character) {
	if (character.prevX > this.x + this.length + images.fenceImageVer.naturalWidth && (character.x) < this.x + this.length + images.fenceImageVer.naturalWidth
		&& (character.y + character.height/1.6) < this.y + images.fenceImageHor.naturalHeight 
			&& (character.y + character.height) > this.y){
		return true;
	}else if (character.prevX+character.width < this.x - images.fenceImageVer.naturalWidth && character.x+character.width > this.x - images.fenceImageVer.naturalWidth
		&& (character.y + character.height/1.6) < this.y + images.fenceImageHor.naturalHeight 
			&& (character.y + character.height) > this.y){
		return true;
	}
	return false;
};

house.prototype.collide = function(character){ //returns 0 for no collision, 1 for vertical collision, 2 for horizontal collision
	if (character.x <= this.x2 && character.x+character.width >= this.x
		&& (character.y + character.height/1.6) <= this.y2
		&& (character.y + character.height) >= (this.y+this.y2)/2 ){
		if(this.doorClosed){
			if (character.prevX > this.x2 || character.prevX + character.width < this.x){
				return 1;
			}else if (character.prevY + character.height/1.6 > this.y2 || character.prevY + character.height < (this.y+this.y2)/2){
				return 2;
			}		
		}else{
			if  (character.y + character.height/1.6 <= (this.y+this.y2)/2 + 30){
				this.openTab();
				return 1;
			}else if (character.x <  this.x + this.doorX && character.x + character.width > this.x
				&& character.y + character.height/1.6 < this.y2 && character.y + character.height > this.y){
				if (character.prevX > this.x + this.doorX || character.prevX + character.width < this.x){
					return 1;
				}else if (character.prevY + character.height/1.6 > this.y2 || character.prevY + character.height < (this.y+this.y2)/2 + 30){
					return 2;
				}
			}else if  (character.x <  this.x2 && character.x + character.width > this.x + this.doorX2
				&& character.y + character.height/1.6 < this.y2 && character.y + character.height > (this.y+this.y2)/2 + 30){
				if (character.prevX + character.width < this.x + this.doorX2 || character.prevX > this.x2){
					return 1;
				}else if (character.prevY + character.height/1.6 > this.y2 || character.prevY + character.height < (this.y+this.y2)/2 + 30){
					return 2;
				}
			}
		}		
	}
	return 0;
}

house.prototype.crash = function(character){ //returns normal true/false collision
	if (character.x < this.x2 && character.x+character.width > this.x
		&& (character.y + character.height/1.6) < this.y2
		&& (character.y + character.height) > (this.y+this.y2)/2 ){
		return true;
	}
	return false;
}

house.prototype.openTab = function(){
	openLink(this.tab);
}

house.prototype.moveCharacterOver = function(character){
	character.direction = characterDirection.S;
	character.x = this.x + (this.doorX + this.doorX2)/2 - character.width/2;
	character.y = (this.y+this.y2)/2 + 35 - character.height/1.6;
}

house.prototype.atDoor = function(character){ 
	var detectionRadius = 30;
	if (character.x+character.width < this.x + this.doorX2 + detectionRadius && character.x > this.x + this.doorX - detectionRadius
		&& character.y < this.y2 + detectionRadius && character.y + character.height > (this.y+this.y2)/2+7){
		return true;
	}
	return false;
}

house.prototype.openDoor = function(){ 
	this.doorClosed = false;
}

house.prototype.closeDoor = function(){ 
	this.doorClosed = true;
}

road.prototype.isLastOne = function() { 
	for (var i=roads.length-1; i>0; i--){
		if(roads[i].type==this.type){
			return this.isEquals(roads[i]);
		}
	}
	return false;
};

road.prototype.isEquals = function(other) { 
	if (this.type == other.type &&
	this.length == other.length &&
	this.width == other.width &&
	this.x == other.x &&
	this.y == other.y &&
	this.x2 == other.x2 &&
	this.y2 == other.y2){
		return true;
	}
	return false;
};

function compareRoads(a,b){
	if (a.type < b.type){
		return -1;
	}else if (a.type > b.type){
		return 1;
	}
	if (a.y < b.y){
		return 1;
	}else if (a.y > b.y){
		return -1;
	}
	return 0;
}