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
			c.push(obj.toSaveable());
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

	var cx = this.location.x, cy = this.location.y, cz = this.location.z;
	if(realdir&RealDirection.NORTH) {
		cy--;
	} else if(realdir&RealDirection.SOUTH) {
		cy++;
	}

	if(realdir&RealDirection.EAST) {
		cx++;
	} else if(realdir&RealDirection.WEST) {
		cx--;
	}

	return this.map.locate(cx,cy,cz);
}

Mappable.prototype.getLocation = function() {
	return this.location;
}

Mappable.prototype.contains = function(mappable) {
	return this.contents.indexOf(mappable) == -1 ? false : true;
}

Mappable.prototype.addToContents = function(mappable) {
	this.contents.push(mappable);
}

Mappable.prototype.removeFromContents = function(mappable) {
	var pos = this.contents.indexOf(mappable);
	if(pos == -1) {
		return;
	}

	this.contents.splice(pos,1);
}

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

Mappable.prototype.onEnter = function(mappable) {
}

Mappable.prototype.onExit = function(mappable) {
}

Mappable.prototype.canEnter = function(mappable) {
	return true;
}

Mappable.prototype.canExit = function(mappable) {
	return true;
}

module.exports = Mappable;
