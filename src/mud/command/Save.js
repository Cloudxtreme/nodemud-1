var Command = require("../datum/Command");
var MUD = require("../MUD");
var Movable = require("../atom/Movable");

function OOC() {
	Command.call(this);

	this.regex = /^save$/i

	this.execute = function(mob, message) {
		var obj = new Movable();
		obj.move(mob);
		MUD.sendLine(JSON.stringify(mob.toSaveable(), null, "\t"), MessageMode.COMMAND);
	}
}

OOC.prototype = new Command();

module.exports = OOC;
