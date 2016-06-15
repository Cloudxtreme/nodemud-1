// local requires
require("../util/String");
var Log = require("./Log");

/**
 * Contains all data and methods for managing the normal operations of the game.
 * @namespace MUD
 */
var MUD = {};

/** The server the MUD is listening on. */
MUD.server = null;

/**
 * Players connect to the MUD.
 * @type {Player[]}
 */
MUD.players = [];

/**
 * The MUD's active map.
 * @type {Map}
 */
MUD.map = null;

/**
 * Begin handling a new player connection.
 * @param {Player} player Player to begin handling.
 */
MUD.nanny = function(player) {
	var Database = require("./Database");
	var Mob = require("./atom/Mob");
	var mob, name, password, race, _class;

	// starters
	var getName, getPassword, getRace, getClass, getMOTD;

	// callbacks
	var onName, onPassword, onRace, onClass, onMOTD;

	// greeting
	player.sendLine("This is the greeting.");

	// definitions
	getName = function() {
		player.request("What's your name?", onName);
	}

	onName = function(input) {
		if(input.length < 3) {
			this.sendLine("Name must be more than 3 characters.");
			getName();
			return
		}

		if(input.length > 12) {
			this.sendLine("Name must be less than 12 characters.");
			getName();
			return
		}

		name = input;
		getPassword();
	}

	getPassword = function() {
		player.request("Please enter a password:", onPassword);
	}

	onPassword = function(input) {
		password = input;
		getRace();
	}

	getRace = function() {
		player.request("Enter a race:", onRace);
	}

	onRace = function(input) {
		race = input;
		getClass();
	}

	getClass = function() {
		player.request("Enter a class:", onClass);
	}

	onClass = function(input) {
		_class = input;
		getMOTD();
	}

	getMOTD = function() {
		player.sendLine(String.format("Your choices: {0}, {1}, {2}, {3}", name, password, race, _class));
		player.request("{\r\n\tTHIS IS THE MOTD.\r\n}", onMOTD);
	}

	onMOTD = function(input) {
		mob = new Mob(MUD.map, MUD.map.locate(0,0,0), Database.getNextCharacterID());
		mob.keywords = name;
		mob.display = name;
		mob.description = null;
		this.setMob(mob);
		mob.showRoom();
	}

	// entry request
	getName();
}

/**
 * Send a line to all connected players.
 * @param {String} str String to send.
 * @param {Number} mode Message mode value.
 */
MUD.sendLine = function(str, mode, sender) {
	for(var player of MUD.players) {
		if(player != sender) {
			player.sendLine(str, mode);
		}
	}
}

/**
 * Begin listening to a server.
 * @param {Server} server Server to listen to.
 */
MUD.setServer = function(server) {
	if(this.server) {
		this.server.removeListener("connect", this.onConnect);
		this.server.removeListener("disconnect", this.onDisconnect);
	}

	this.server = server;

	if(server) {
		server.on("connect", this.onConnect);
		server.on("disconnect", this.onDisconnect);
	}
}

/**
 * Prepare the MUD so it can be played.<br/><br/>
 * <b>Must be called before new players can join.</b>
 */
MUD.initialize = function() {
	var Map = require("./datum/Map");
	this.map = new Map(255,255,1);
}

/**
 * Generate a new player for a client.
 * @param {Client} client Client to generate a player for.
 * @return {Player}
 */
MUD.generatePlayer = function(client) {
	var Database = require("./Database");
	var Player = require("./datum/Player");
	var player = new Player(Database.getNextPlayerID(), client);
	MUD.players.push(player);
	return player;
}

/**
 * Called when a new client connects.
 * @param {Client} client Client connecting.
 */
MUD.onConnect = function(client) {
	var player = MUD.generatePlayer(client);
	Log.log("Connecting player: " + player.toString());
	MUD.nanny(player);
}

/**
 * Called when a client disconnects.
 * @param {Client} client Client disconnecting.
 */
MUD.onDisconnect = function(client) {
	if(client.player) {
		Log.log("Disconnecting player: " + client.player);
		var pos = MUD.players.indexOf(client.player);
		if(pos == -1) {
			return;
		}

		MUD.players.splice(pos,1);

		if(client.player.mob) {
			var mob = client.player.mob;
			mob.setPlayer(null);
			mob.setLocation(null);
		}
	}
}

module.exports = MUD;
