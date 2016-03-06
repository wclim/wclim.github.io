const ROADWIDTH = 300;

var fence = function (type, pos, x, y, length, parent) {
	this.type = type; //0 for horizontal on left of main road, 1 for vertical, 2 for horizontal on right of main road
	this.roadPosition = pos; //left right bottom and top, indicates the position of the road relative to fence
	this.length = length;
	this.x = x;
	this.y = y;
	this.parentRoad = parent;
};

var road = function (type, x, y, width, length) {
	this.type = type; //0 for main road, 1 for left side road, 2 for right side road
	this.length = length;
	this.width = width;
	this.x = x;
	this.y = y;
	this.x2 = this.x + width;
	this.y2 = this.y + length;
};

fence.prototype.collide = function(character) { //returns 0 for no collision, returns 1 for vertical fence collision, returns 2 for horizontal fence collision
	if (this.type == 0 || this.type == 2){
		if (this.collideFromSide(character)){
			return 1;
		}
		if ((character.x) < this.x + this.length + fenceImageVer.naturalWidth
			&& (character.x+character.width) > this.x - fenceImageVer.naturalWidth
			&& (character.y + character.height/1.6) < this.y + fenceImageHor.naturalHeight 
			&& (character.y + character.height) > this.y){
			return 2;
		}
	} else if(this.type == 1){
		if ((character.x) < this.x + fenceImageVer.naturalWidth
			&& (character.x+character.width) > this.x
			&& (character.y + character.height/1.6) < this.y + this.length
			&& (character.y + character.height) > this.y){
			return 1;
		}
	}
	return 0;
};

fence.prototype.collideFromSide = function(character) {
	if (character.prevX > this.x + this.length + fenceImageVer.naturalWidth && (character.x) < this.x + this.length + fenceImageVer.naturalWidth
		&& (character.y + character.height/1.6) < this.y + fenceImageHor.naturalHeight 
			&& (character.y + character.height) > this.y){
		return true;
	}else if (character.prevX+character.width < this.x - fenceImageVer.naturalWidth && character.x+character.width > this.x - fenceImageVer.naturalWidth
		&& (character.y + character.height/1.6) < this.y + fenceImageHor.naturalHeight 
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