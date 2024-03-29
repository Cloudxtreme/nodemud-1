// node requires
var fs = require("fs");

// local requires
require("../util/String");
var MUD = require("./MUD");
var Logger = require("./datum/Logger");

/**
 * Contains all data loaded at runtime, and methods related to saving and loading data.
 * @namespace Database
 */
var Database = {};

/**
 * Meta data about the game.
 * @namespace Database.meta
 */
Database.meta = {};

/**
 * Name of the MUD.
 * @type {String}
 * @default "nodemud"
 */
Database.meta.name = "nodemud";

/**
 * Current version of the MUD.
 * @type {String}
 * @default "0.0.0.0"
 */
Database.meta.version = "0.0.0.0";

/**
 * Default port to host the MUD on.
 * @type {Number}
 * @default 8000
 */
Database.meta.defaultPort = 8000;

/**
 * Persistent data about the game.
 * @namespace Database.persistent
 */
Database.persistent = {};

/**
 * Universal unique ID for characters.
 * @type {Number}
 * @default 0
 */
Database.persistent.characterID = 0;

/**
 * Data unique to this session of the game.
 * @namespace Database.session
 */
Database.session = {};

/**
 * Session unique ID for player connections.
 * @type {Number}
 * @default 0
 */
Database.session.playerID = 0;

/**
 * List of hard-coded commands.
 * @type {Command[]}
 */
Database.commands = [];

/**
 * List of soft-coded (user-defined) commands.
 * @type {UserCommand[]}
 */
Database.userCommands = [];

/**
 * Contains raw savable (JSON) objects that represent runtime objects.
 * @namespace Database.userdata
 */
Database.userdata = {};

/**
 * List of characters.
 * @type {Object[]}
 */
Database.userdata.characters = [];

/**
 * List of user-defined commands.
 * @type {Object[]}
 */
Database.userdata.commands = [];

/**
 * List of help-files.
 * @type {Object[]}
 */
Database.userdata.help = [];

/**
 * Generic logger.
 */
Database.logger = new Logger();

/**
 * Retrieve the next available character ID.
 * @return {Number}
 */
Database.getNextCharacterID = function() {
	var id = this.persistent.characterID++;
	this.savePersistent();
	return id;
}

/**
 * Retrieve the next available player ID.
 * @return {Number}
 */
Database.getNextPlayerID = function() {
	return this.session.playerID++;
}

/**
 * Process command input from a mob.
 * @param {Mob} mob Mob attempting to use a command.
 * @param {String} input Input to process.
 * @return {boolean} true on success, false otherwise.
 */
Database.processCommand = function(mob, input) {
	for(var command of Database.commands) {
		if(command.match(mob, input)) {
			command.process(mob, input);
			return command;
		}
	}

	for(var command of Database.userCommands) {
		if(command.match(mob, input)) {
			command.process(mob, input);
			return command;
		}
	}

	return false;
}

/**
 * Load all runtime data.
 */
Database.load = function() {
	Database.logger.boot("Loading database files...");
	this.loadMeta();
	this.loadPersistent();
	this.loadCommands();
	this.loadUserCommands();
}

/**
 * Load meta data.
 */
Database.loadMeta = function() {
	if(fs.existsSync("./data/meta.json")) {
		this.meta = require("../../data/meta.json");
		Database.logger.boot("> Loaded meta.json");
	}
}

/**
 * Load persistent data.
 */
Database.loadPersistent = function() {
	if(fs.existsSync("./data/persistent.json")) {
		this.persistent = require("../../data/persistent.json");
		Database.logger.boot("> Loaded persistent.json");
	}
}

/**
 * Load all hard-coded commands.
 */
Database.loadCommands = function() {
	var files = fs.readdirSync("./src/mud/command/");
	if(files.length) {
		Database.logger.boot("> Loading commands...");
		for(var file of files) {
			var s = file.split(".");
			try {
				var command = require("./command/"+s[0]);
				var instance = new command();
				if(instance.load == false) continue;
				if(instance.regex == null) continue;
				Database.commands.push(instance);
				Database.logger.boot(">  Loaded "+file);
			} catch(e) {
				Database.logger.error(String.format("Failed to load command '{0}' ({1})", s[0], e));
			}
		}
	}
}

/**
 * Load all user-defined commands.
 */
Database.loadUserCommands = function() {
	var files = fs.readdirSync("./data/commands/");
	if(files.length) {
		Database.logger.boot("> Loading user commands...");
		var UserCommand = require("./datum/UserCommand");
		for(var file of files) {
			var s = file.split(".");
			try {
				var data = require("../../data/commands/"+s[0]);
				Database.userdata.commands.push(data);
				var instance = new UserCommand(data);
				Database.userCommands.push(instance);
				Database.logger.boot(">  Loaded "+file);
			} catch(e) {
				Database.logger.error(String.format("Failed to load user command '{0}' ({1})", s[0], e));
			}
		}
	}
}

/**
 * Save all runtime data.
 * @param {boolean} block Should the operation block?
 */
Database.save = function(block) {
	Database.saveMeta(block);
	Database.savePersistent(block);
}

/**
 * Save meta data.
 * @param {boolean} block Should the operation block?
 */
Database.saveMeta = function(block) {
	try {
		fs.writeFile("./data/meta.json~", JSON.stringify(Database.meta, null, "\t"), function(err) {
			if(err) throw err;
			fs.rename("./data/meta.json~", "./data/meta.json");
		});
	} catch(e) {
		Database.logger.error(String.format("Failed to save meta data ({1})", e.code));
	}
}

/**
 * Save persistent data.
 * @param {boolean} block Should the operation block?
 */
Database.savePersistent = function(block) {
	try {
		fs.writeFile("./data/persistent.json~", JSON.stringify(Database.persistent, null, "\t"), function(err) {
			if(err) throw err;
			fs.rename("./data/persistent.json~", "./data/persistent.json");
		});
	} catch(e) {
		Database.logger.error(String.format("Failed to save persistent data ({1})", e))
	}
}

module.exports = Database;
