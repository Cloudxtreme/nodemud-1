// local requires
var MUD = require("../MUD");
var Database = require("../Database");
var Logger = require("../Logger");
var MessageMode = require("../MessageMode");

/**
 * Go-between for a Client and MUD.
 * @param {Number} id ID of the player.
 * @param {Client} client Client to control this player.
 * @constructor Player
 */
function Player(id, client) {
	var __ = this;

	/** Private function that listens for data from Client. */
	var onData = function(data) {
		var multi = data.split("\r\n");
		if(multi.length==1) {
			Logger.error("non-command input: " + multi);
			return;
		} else {
			multi.length--;
		}

		for(var cmd of multi) {
			__.input(cmd);
		}
	}

	/**
	 * Begin listening to client for data.
	 * @instance
	 * @method setClient
	 * @memberof Player
	 * @param {Client} client Client to begin listening to.
	 */
	this.setClient = function(client) {
		if(this.client) {
			// stop listening for data from this client
			this.client.removeListener("data", onData);
		}

		this.client = client;

		if(client) {
			if(client.player != this) {
				client.setPlayer(this);
			}

			// listen for client data
			client.on("data", onData);
		}
	}

	// initialize
	if(id != null) {
		this.id = id;
	}

	if(client) {
		this.setClient(client);
	}
}

/**
 * Unique player ID for this game session.
 * @type {Number?}
 */
Player.prototype.id = null;

/** 
 * Message mode for player.
 * @type {MessageMode?}
 */
Player.prototype.messageMode = MessageMode.MISC;

/**
 * Client being managed by this player.
 * @type {Client?}
 */
Player.prototype.client = null;

/**
 * Mob being managed by this player.
 * @type {Mob?}
 */
Player.prototype.mob = null;

/**
 * Function to pipe next input into.
 * @type {Function?}
 */
Player.prototype.callback = null;

/**
 * Returns a JSON object to represent this player that can be saved.
 * @return {Object}
 */
Player.prototype.toSavable = function() {
	var savable = {
		"type": "Player",
		"id": this.id
	};

	if(this.mob) {
		savable.mob = this.mob.toSavable();
	}

	return savable;
}

/**
 * Safe string version of player.
 * @return {String}
 */
Player.prototype.toString = function() {
	var str = "player#"+this.id;
	if(this.client) {
		str += "{"+this.client+"}";
	}

	return str;
}

/**
 * Begin managing a mob.
 * @param {Mob} mob Mob to begin managing.
 */
Player.prototype.setMob = function(mob) {
	if(this.mob) {
		var oMob = this.mob;
		this.mob = null;
		oMob.setPlayer(null);
	}

	this.mob = mob;

	if(mob && mob.player != this) {
		mob.setPlayer(this);
	}
}

/**
 * Get the client controlling this player.
 * @return {Client?}
 */
Player.prototype.getClient = function() {
	return this.client;
}

/**
 * Get the player's unique session ID.
 * @return {Number}
 */
Player.prototype.getID = function() {
	return this.id;
}

/**
 * Disconnect the player manually.
 */
Player.prototype.logout = function() {
	if(!this.client) return;
	this.sendLine(JSON.stringify({"player":this.getID(), "mob":this.mob.getCharacterID(), "exitCode":0x49273}));
	this.client.close();
	this.setClient(null);
}

/**
 * Resets the player's message mode.
 */
Player.prototype.resetMessageMode = function() {
	this.messageMode = null;
}

/**
 * Send string (no linefeed) to the player.
 * @param {String} string String to send.
 */
Player.prototype.send = function(string) {
	if(this.client) {
		this.client.send(string);
	}
}

/**
 * Send string (with linefeed) to the player.
 * @param {String} string String to send.
 */
Player.prototype.sendLine = function(string, mode) {
	if(mode == null) mode = MessageMode.MISC;
	if(this.messageMode != null && this.messageMode != mode) {
		this.client.sendLine("");
	}

	this.messageMode = mode;
	if(this.client) {
		this.client.sendLine(string);
	}
}

/**
 * Send a question (optional) and assign a callback to pipe input to.
 * @param {String} question Question to ask.
 * @param {Function} callback Function to send input to.
 */
Player.prototype.request = function(question, callback) {
	if(question) {
		this.send(question+" ");
	}

	if(callback) {
		this.callback = callback;
	}
}

/**
 * Called when input has been received from the client.
 * @param {String} input Input received.
 */
Player.prototype.input = function(input) {
	this.resetMessageMode();
	Logger.log(this.toString(), "'" + input + "'");
	if(this.callback) {
		// disassociate callback before calling
		// so the callback can propagate more callbacks
		var _callback = this.callback;
		this.callback = null;
		_callback.call(this, input);
		return;
	}

	if(!Database.processCommand(this.mob, input)) {
		this.sendLine("Do what now?", MessageMode.COMMAND);
	}
}

module.exports = Player;
