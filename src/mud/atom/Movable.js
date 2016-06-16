var Mappable = require("./Mappable");
var Tile = require("./Tile");

/**
 * Movable mappable objects.
 * @param {Map?} map Map to be placed on.
 * @param {Mappable?} location Location to be placed in.
 * @constructor
 * @extends Mappable
 */
function Movable(map, location) {
	Mappable.call(this, map, location);
}

Movable.prototype = new Mappable();
Movable.prototype.keywords = "movable";
Movable.prototype.display = "movable";
Movable.prototype.description = "A movable.";

Movable.prototype.toSavable = function() {
	var savable = Mappable.prototype.toSavable.call(this);
	savable.type = "Movable";

	if(this.location != null && this.location instanceof Tile) {
		savable.location = this.location.getCoordinates();
	}

	return savable;
}

/**
 * Check if you can legally move to a given location (some form of {@link Mappable}).
 * @param {Mappable} location Location to move to.
 * @return {boolean} true if possible; false otherwise.
 */
Movable.prototype.canMove = function(location) {
	if(this.location && !this.location.canExit(this)) return false;
	if(!location.canEnter(this)) return false;
	return true;
}

/**
 * Attempt to move to a location (some form of {@link Mappable}).
 * @param {Mappable} location Location to move to.
 * @return {boolean} true on success; false otherwise.
 */
Movable.prototype.move = function(location) {
	if(!this.canMove(location)) return false;
	this.setLocation(null);
	location.onExit(this);
	this.setLocation(location);
	location.onEnter(this);
	return true;
}

/**
 * Attempt to move to an XYZ coordinate on the same map.
 * @param {Number} x X coordinate.
 * @param {Number} y Y coordinate.
 * @param {Number} z Z coordinate.
 * @return {boolean} true on success; false otherwise.
 */
Movable.prototype.moveTo = function(x,y,z) {
	if(!this.map) return false;
	var location = this.map.locate(x,y,z);
	if(!location) return false;
	return this.move(location);
}


/**
 * Attempt to step in a direction.
 * @param {RealDirection} dir Real direction to attempt to step in.
 * @return {boolean} true on success; false otherwise
 */
Movable.prototype.step = function(dir) {
	var location = this.getStep(dir);
	if(location) {
		return this.move(location);
	}

	return false;
}

module.exports = Movable;
