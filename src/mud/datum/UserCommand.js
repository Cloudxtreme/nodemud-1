var vm = require("vm");
var Command = require("./Command");
var MUD = require("../MUD");
var Database = require("../Database");
var RealDirection = require("../RealDirection");
var Direction = require("../Direction");
var Mappable = require("../atom/Mappable");
var Movable = require("../atom/Movable");
var Mob = require("../atom/Mob");
var Tile = require("../atom/Tile");
var Log = require("../Log");
require("../../util/String");

/*var SafeContext = {
	MUD:{
		map:MUD.map,
		sendLine:MUD.sendLine
	},

	Database:{
		meta:Database.meta
	},

	Log:Log,
	String:String,
	Mappable:Mappable,
	Movable:Movable,
	Tile:Tile,
	Mob:Mob,
	RealDirection:RealDirection,
	Direction:Direction
};*/

/**
 * Object used for processing commands defined at runtime.
 * @param {String?} regex RegExp to assign to command.
 * @param {String?} body Body of the function to execute.
 * @constructor
 * @extends Command
 */
function UserCommand(regex, body) {
	Command.call(this);

	// initialize
	if(regex) {
		this.regex = new RegExp(regex, "i");
	}

	if(body) {
		this.body = body;
	}
}

UserCommand.prototype = new Command();

/** The body of the function for this command. */
UserCommand.prototype.body = null;

/** @default false */
UserCommand.prototype.load = false;

/**
 * Runs the body of the user-defined command in a virtual machine with a safe context.<br/><br/>
 * Has limited access to the following packages:
 * <ul>
 *  <li>{@link MUD} <sup>only has access to following members</sup></li>
 *  <ul>
 *   <li>{@link MUD.map}</li>
 *   <li>{@link MUD.sendLine}</li>
 *  </ul>
 *  <li>{@link Database} <sup>only has access to following members</sup></li>
 *  <ul>
 *   <li>{@link Database.meta} <sup>all members</sup></li>
 *  </ul>
 * </ul>
 * Has complete access to the following packages:
 * <ul>
 *  <li>String</li>
 *  <li>{@link Log}</li>
 *  <li>{@link RealDirection}</li>
 *  <li>{@link Direction}</li>
 * </ul>
 * Has complete access to the following objects:
 * <ul>
 *  <li>{@link Mappable}</li>
 *  <li>{@link Tile}</li>
 *  <li>{@link Movable}</li>
 *  <li>{@link Mob}</li>
 * </ul>
 * Has access to unique variables:
 * <ul>
 *  <li>user</li>
 *  <ul>
 *   <li>The mob using the command.</li>
 *  </ul>
 *  <li>arguments</li>
 *  <ul>
 *   <li>Array of arguments supplied to the command.</li>
 *  </ul>
 * </ul>
 */
UserCommand.prototype.execute = function(mob) {
	var script = new vm.Script(this.body);
	var _context = {
		// obfuscated namespaces
		MUD:{
			map:MUD.map,
			sendLine:MUD.sendLine
		},

		Database:{
			meta:Database.meta
		},

		// namespaces we share whole-cloth
		String:String,
		Log:Log,
		RealDirection:RealDirection,
		Direction:Direction,

		// objects we share whole-cloth
		Mappable:Mappable,
		Movable:Movable,
		Tile:Tile,
		Mob:Mob,

		// instance specific values
		user:mob,
		arguments:Array.prototype.slice.call(arguments, 1)
	};

	var context = new vm.createContext(_context);
	try {
		script.runInContext(context);
	} catch(e) {
		Log.error(String.format("Failed to run user command '{0}' ({1})", this.regex, e));
	}
}

module.exports = UserCommand;
