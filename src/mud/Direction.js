// local requires
var RealDirection = require("./RealDirection");

/**
 * Handles conversion between real directions and text.
 * @namespace Direction
 */
var Direction = {};

/**
 * @readonly
 * @enum {RealDirection}
 */
Direction.long = {
	"north":RealDirection.NORTH,
	"south":RealDirection.SOUTH,
	"east":RealDirection.EAST,
	"west":RealDirection.WEST,
	"northeast":RealDirection.NORTHEAST,
	"northwest":RealDirection.NORTHWEST,
	"southeast":RealDirection.SOUTHEAST,
	"southwest":RealDirection.SOUTHWEST
}

/**
 * @readonly
 * @enum {RealDirection}
 */
Direction.short = {
	"n":RealDirection.NORTH,
	"s":RealDirection.SOUTH,
	"e":RealDirection.EAST,
	"w":RealDirection.WEST,
	"ne":RealDirection.NORTHEAST,
	"nw":RealDirection.NORTHWEST,
	"se":RealDirection.SOUTHEAST,
	"sw":RealDirection.SOUTHWEST
}

/**
 * Converts a long direction (north, south, east, west, etc...) into a RealDirection.
 * @return {RealDirection}
 */
Direction.longToReal = function(direction) {
	return Direction.long[direction];
}

/**
 * Converts a short direction (n, s, e, w, etc...) into a RealDirection.
 * @return {RealDirection}
 */
Direction.shortToReal = function(direction) {
	return Direction.short[direction];
}

/**
 * Converts a RealDirection into a long direction (north, south, east, west, etc...).
 * @return {Direction.long}
 */
Direction.realToLong = function(realdir) {
	for(var direction of Direction.long) {
		if(Direction.long[direction] == realdir) {
			return direction;
		}
	}
}

/**
 * Converts a RealDirection into a short direction (n, s, e, w, etc...).
 * @return {Direction.short}
 */
Direction.realToLong = function(realdir) {
	for(var direction of Direction.short) {
		if(Direction.short[direction] == realdir) {
			return direction;
		}
	}
}

module.exports = Direction;
