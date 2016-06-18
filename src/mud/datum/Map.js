// local requires
var Tile = require("../atom/Tile");

/**
 * A Euclidean map using multi-dimensional arrays to represent points in space.
 * @constructor
 * @param {Number} width Width of the map in tiles.
 * @param {Number} height Height of the map in tiles.
 * @param {Number} layers Layers of the map.
 */
function Map(width, height, layers) {
	this.tiles = [];
	this.contents = [];

	this.generate = function(width, height, layers) {
		this.width = width;
		this.height = height;
		this.layers = layers;

		for(var z=0;z<layers;z++) {
			this.tiles[z] = [];
			for(var y=0;y<height;y++) {
				this.tiles[z][y] = [];
				for(var x=0;x<width;x++) {
					this.tiles[z][y][x] = new Tile(this,x,y,z);
				}
			}
		}
	}

	// initialize
	if(width && height && layers) {
		this.generate(width, height, layers);
	}
}

/**
 * 3 dimensional array representing tiles in 3D space.
 * @type {Tile[][][]}
 */
Map.prototype.tiles = null;

/**
 * All mappable objects represented on the map.
 * @type {Mappable[]}
 */
Map.prototype.contents = null;

/**
 * Width of the map in tiles.
 * @type {Number}
 * @default 0
 */
Map.prototype.width = 0;

/**
 * Height of the map in tiles.
 * @type {Number}
 * @default 0
 */
Map.prototype.height = 0;

/**
 * Layers of the map.
 * @type {Number}
 * @default 0
 */
Map.prototype.layers = 0;

/**
 * Locate a tile at the given xyz coordinate.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Tile?}
 */
Map.prototype.locate = function(x,y,z) {
	if((x<0 || x>=this.width) || (y<0 || y>=this.height) || (z<0 || z>=this.layers)) {
		return null;
	}

	return this.tiles[z][y][x];
}

/**
 * Check if the map contains a given mappable.
 * @param {Mappable} mappable Mappable to check for.
 * @return {boolean}
 */
Map.prototype.contains = function(mappable) {
	return this.contents.indexOf(mappable) == -1 ? false : true;
}

/**
 * Add a mappable to the map's contents.
 * @param {Mappable} mappable Mappable to add.
 */
Map.prototype.addToContents = function(mappable) {
	if(this.contains(mappable)) return;
	this.contents.push(mappable);
	mappable.setMap(this);
}

/**
 * Remove a mappable from the map's contents.
 * @param {Mappable} mappable Mappable to remove.
 */
Map.prototype.removeFromContents = function(mappable) {
	var pos = this.contents.indexOf(mappable);
	if(pos == -1) {
		return;
	}

	this.contents.splice(pos,1);
	mappable.setMap(null);
}

module.exports = Map;
