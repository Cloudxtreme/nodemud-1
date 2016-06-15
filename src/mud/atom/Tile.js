require("../../util/String");
var Mappable = require("./Mappable");

/**
 * A mappable object with a static XYZ coordinate.<br/><br/>
 * <b>Used in Eucliean maps to represent static points in 3D space.</b>
 * @param {Map?} map Map to be placed on.
 * @param {Number?} x X coordinate.
 * @param {Number?} y Y coordinate.
 * @param {Number?} z Z coordinate.
 * @constructor
 * @extends Mappable
 */
function Tile(map,x,y,z) {
	// call super constructor
	Mappable.call(this,map);

	// initialize
	if(x != null && y != null && z != null) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

Tile.prototype = new Mappable();

Tile.prototype.keywords = "tile";
Tile.prototype.display = "tile";
Tile.prototype.description = "A tile.";

/**
 * The tile's x coordinate.
 */
Tile.prototype.x = 0;

/**
 * The tile's y coordinate.
 */
Tile.prototype.y = 0;

/**
 * The tile's z coordinate.
 */
Tile.prototype.z = 0;

Tile.prototype.toSavable = function() {
	var savable = Tile.prototype.toSaveable.call(this);
	savable.type = "Tile";
	return savable;
}

module.exports = Tile;