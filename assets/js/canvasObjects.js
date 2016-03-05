const ROADWIDTH = 300;

var fences = [];
var roads = [];

var fence = function (type, x, y, length) {
	this.type = type; //0 for horizontal on left on main road, 1 for vertical, 2 for horizontal on right of main road
	this.length = length;
	this.x = x;
	this.y = y;
};

var road = function (x, y, width, length) {
	this.length = length;
	this.width = width;
	this.x = x;
	this.y = y;
};

fence.prototype.printCoordinates = function() {
  console.log("Coordinates: " + this.x + "," + this.y);
};