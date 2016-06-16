// local requires
var Mappable = require("./Mappable");

/**
 * A mappable object with a static XYZ coordinate.<br/><br/>
 * <b>Used in Eucliean maps to represent static points in 3D space.</b>
 * @param {Map} map Map to be placed on.
 * @param {Number} x X coordinate.
 * @param {Number} y Y coordinate.
 * @param {Number} z Z coordinate.
 * @constructor
 * @extends Mappable
 */
function Tile(map,x,y,z) {
	// call super constructor
	Mappable.call(this,map);

	/**
	 * Retreive the tile's X coordinate.
	 * @return {Number}
	 */
	this.getX = function() {
		return x;
	}

	/**
	 * Retreive the tile's Y coordinate.
	 * @return {Number}
	 */
	this.getY = function() {
		return y;
	}

	/**
	 * Retreive the tile's Z coordinate.
	 * @return {Number}
	 */
	this.getZ = function() {
		return z;
	}
}

Tile.prototype = new Mappable();
Tile.prototype.keywords = "tile";
Tile.prototype.display = "tile";
Tile.prototype.description = "A tile.";

/**
 * Get the coordinates of this tile as a JSON object.
 * @return {Object}
 */
Tile.prototype.getCoordinates = function() {
	return {x:this.getX(),y:this.getY(),z:this.getZ()};
}

Tile.prototype.toSavable = function() {
	var savable = Mappable.prototype.toSaveable.call(this);
	savable.type = "Tile";
	return savable;
}

module.exports = Tile;