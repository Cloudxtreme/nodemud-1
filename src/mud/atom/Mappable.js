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
Mappable.prototype.keywords = "mappable"; // keywords for reference

/**
 * String used to display this mappable.
 * @type {String}
 */
Mappable.prototype.display = "mappable"; // display name shown in rooms and such

/**
 * Longer description of the mappable.
 * @type {String}
 */
Mappable.prototype.description = "A mappable object."; // long description for object.

/**
 * Current map this mappable is on.
 * @type {Map}
 */
Mappable.prototype.map = null; // map this mappable is inhabiting

/**
 * Current location (another mappable).
 * @type {Mappable}
 */
Mappable.prototype.location = null; // null or another mappable

/**
 * Contents of this mappable.
 * @type {Mappable[]}
 */
Mappable.prototype.contents = null;

/**
 * Returns a JSON object to represent this mappable that can be saved.
 * @return {Object}
 */
Mappable.prototype.toSavable = function() {
	var savable = {
		"type": "Mappable",
		"keywords": this.keywords,
		"display": this.display,
		"description": this.description
	};

	if(this.contents.length) {
		var c = [];
		for(var i=0;i<this.contents.length;i++) {
			var obj = this.contents[i];
			c.push(obj.toSavable());
		}

		savable.contents = c;
	}

	return savable;
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
	this.contents.push(mappable);
	if(mappable.location != this) {
		mappable.setLocation(this);
	}
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
	if(mappable.location == this) {
		mappable.setLocation(null);
	}
}

/**
 * Set the Mappable's current map.
 * @param {Map} map Map to move to.
 */
Mappable.prototype.setMap = function(map) {
	if(this.map) {
		var oMap = this.map;
		this.map = null;
		oMap.removeFromContents(this);
	}

	this.map = map;

	if(map && !map.contains(this)) {
		map.addToContents(this);
	} else if(!map || this.location.map != map) {
		this.setLocation(null);
	}
}

/**
 * Set the Mappable's current location.
 * @param {Mappable} mappable New location.
 */
Mappable.prototype.setLocation = function(mappable) {
	if(this.location) {
		this.location.removeFromContents(this);
	}

	this.location = mappable;

	if(mappable) {
		if(this.map != mappable.map) {
			this.setMap(mappable.map);
		}
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
