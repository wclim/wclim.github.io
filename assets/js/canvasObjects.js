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