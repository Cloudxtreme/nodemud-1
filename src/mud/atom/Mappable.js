var RealDirection = require("../RealDirection");

/**
 * Objects that can be mapped.
 * @param {Map?} map Map to be placed on.
 * @param {Mappable?} location Location to be placed in.
 * @constructor
 */
function Mappable(map, location) {
	this.contents = [];

	// initialize
	if(map) {
		this.setMap(map);
	}

	if(location) {
		this.setLocation(location);
	}
}

/**
 * Keywords for referencing this mappable.
 * @type {String}
 */
Mappable.prototype.keywords = "mappable";

/**
 * String used to display this mappable.
 * @type {String}
 */
Mappable.prototype.display = "mappable";

/**
 * Longer description of the mappable.
 * @type {String}
 */
Mappable.prototype.description = null;

/**
 * Current map this mappable is on.
 * @type {Map}
 */
Mappable.prototype.map = null;

/**
 * Current location (another mappable).
 * @type {Mappable}
 */
Mappable.prototype.location = null;

/**
 * Contents of this mappable.
 * @type {Mappable[]}
 */
Mappable.prototype.contents = null;

Mappable.prototype.getJSON = function() {
	var json = {};
	for(var name in this) {
		var value = this.replacer(name, this[name]);
		if(value instanceof Function) continue;
		if(value === undefined) continue;
		json[name] = value;
	}

	return json;
}

Mappable.prototype.replacer = function(name, value) {
	if(value == this.__proto__[name]) return undefined;
	if(name == "contents") {
		if(value.length == 0) return undefined;
		var safe = [];
		for(var i in value) {
			var obj = value[i];
			if(!(obj instanceof Mappable)) continue;
			safe.push(obj.getJSON());
		}

		return safe;
	}
	if(name == "location") return undefined;
	if(name == "map") return undefined;
	return value;
}

/**
 * Returns the mappable's display string.
 * @return {String}
 */
Mappable.prototype.toString = function() {
	return this.display;
}

/**
 * Get a tile in a specific direction.
 * @param {RealDirection} realdir Real direction to check for a tile.
 * @return {Tile?}
 */
Mappable.prototype.getStep = function(realdir) {
	var Tile = require("./Tile");
	if(!this.location || !(this.location instanceof Tile)) {
		return null;
	}

	var loc = this.location.getCoordinates();
	if(realdir&RealDirection.NORTH) {
		loc.y--;
	} else if(realdir&RealDirection.SOUTH) {
		loc.y++;
	}

	if(realdir&RealDirection.EAST) {
		loc.x++;
	} else if(realdir&RealDirection.WEST) {
		loc.x--;
	}

	return this.map.locate(loc.x, loc.y, loc.z);
}

/**
 * Get the mappable's current location*
 * @type {Mappable}
 */
Mappable.prototype.getLocation = function() {
	return this.location;
}

/**
 * Check if the Mappable contains another certain Mappable.
 * @param {Mappable} mappable Mappable to check for.
 * @return {boolean}
 */
Mappable.prototype.contains = function(mappable) {
	return this.contents.indexOf(mappable) == -1 ? false : true;
}

/**
 * Add a mappable to this mappable's contents.
 * @param {Mappable} mappable Mappable to add.
 */
Mappable.prototype.addToContents = function(mappable) {
	if(this.contains(mappable)) return;
	this.contents.push(mappable);
	mappable.setLocation(this);
}

/**
 * Remove a mappable from this mappable's contents.
 * @param {Mappable} mappable Mappable to remove.
 */
Mappable.prototype.removeFromContents = function(mappable) {
	var pos = this.contents.indexOf(mappable);
	if(pos == -1) {
		return;
	}

	this.contents.splice(pos,1);
	mappable.setLocation(null);
}

/**
 * Set the Mappable's current map.
 * @param {Map?} map Map to move to.
 */
Mappable.prototype.setMap = function(map) {
	if(this.map == map) return;

	if(this.map) {
		var oMap = this.map;
		this.map = null;
		oMap.removeFromContents(this);
	}

	this.map = map;

	if(map) {
		map.addToContents(this);
	} else {
		this.setLocation(null);
	}
}

/**
 * Set the Mappable's current location.
 * @param {Mappable?} mappable New location.
 */
Mappable.prototype.setLocation = function(mappable) {
	if(this.location == mappable) return;

	if(this.location) {
		var oLocation = this.location;
		this.location = null;
		oLocation.removeFromContents(this);
	}

	this.location = mappable;

	if(mappable) {
		this.setMap(mappable.map);
		mappable.addToContents(this);
	}
}

/**
 * Called when a mappable has entered.
 * @param {Mappable} mappable Mappable that has entered.
 */
Mappable.prototype.onEnter = function(mappable) {
}

/**
 * Called when a mappable has exited.
 * @param {Mappable} mappable Mappable that has exited.
 */
Mappable.prototype.onExit = function(mappable) {
}

/**
 * Can a mappable enter?
 * @param {Mappable} mappable Mappable trying to enter.
 * @return {boolean}
 */
Mappable.prototype.canEnter = function(mappable) {
	return true;
}

/**
 * Can a mappable exit?
 * @param {Mappable} mappable Mappable trying to exit.
 * @return {boolean}
 */
Mappable.prototype.canExit = function(mappable) {
	return true;
}

module.exports = Mappable;
