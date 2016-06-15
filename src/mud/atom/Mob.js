var Mappable = require("./Mappable");
var Movable = require("./Movable");
var MessageMode = require("../MessageMode");

/**
 * Mobile objects. Used to represent (N)PCs.
 * @param {Map?} map Map to be placed on.
 * @param {Mappable?} location Location to be placed in.
 * @param {Number?} id Unique character ID for this mob.
 * @constructor
 * @extends Movable
 */
function Mob(map, location, id) {
	Movable.call(this, map, location);

	// initialize
	if(id != null) {
		this.characterID = id;
	}
}

Mob.prototype = new Movable();

Mob.prototype.keywords = "mob";
Mob.prototype.display = "mob";
Mob.prototype.description = "A mob.";

/** Unique ID for characters. */
Mob.prototype.characterID = null;

Mob.prototype.toSavable = function() {
	var savable = Movable.prototype.toSavable.call(this);
	savable.type = "Mob";

	if(this.characterID!=null) {
		savable.id = this.characterID;
	}

	return savable;
}

/**
 * Assign the character's unique ID.
 * @param {Number} id Unique character ID.
 */
Mob.prototype.setCharacterID = function(id) {
	this.characterID = id;
}

/**
 * Does the same thing as {@link Movable.move}. However, on success, calls {@link Mob.showRoom}.
 * @param {Mappable} location Location to move to.
 * @return {boolean}
 */
Mob.prototype.move = function(location) {
	if(Movable.prototype.move.call(this, location)) {
		this.showRoom();
		return true;
	}

	return false;
}

/**
 * Show the room to the mob (if it's a player).
 */
Mob.prototype.showRoom = function() {
	var location = this.getLocation();
	if(!location) {
		this.sendLine("You aren't anywhere!");
		return;
	}

	var msg = String.format("{0}\r\n {1}", location.display, location.description);
	for(var etc of location.contents) {
		if(etc == this) continue;
		if(!etc instanceof Mappable) continue;
		msg += String.format("\r\n {0} is here.", etc.display);
	}

	this.sendLine(msg, MessageMode.COMMAND);
}

/**
 * Assign a player to control this mob.
 * @param {Player} player Player to control this mob.
 */
Mob.prototype.setPlayer = function(player) {
	if(this.player) {
		var oPlayer = this.player;
		this.player = null;
		oPlayer.setMob(null);
	}

	this.player = player;

	if(player && player.mob != this) {
		player.setMob(this);
	}
}

/**
 * Send string (no linefeed) to the player.
 * @param {String} string String to send.
 */
Mob.prototype.send = function(string) {
	if(this.player) {
		this.player.send(string);
	}
}

/**
 * Send a string (with linefeed) to the player.
 * @param {String} string String to send.
 */
Mob.prototype.sendLine = function(string) {
	if(this.player) {
		this.player.sendLine(string);
	}
}

module.exports = Mob;
