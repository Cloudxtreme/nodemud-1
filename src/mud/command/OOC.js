// local requires
var Command = require("../datum/Command");
var MUD = require("../MUD");
var MessageMode = require("../MessageMode");
require("../../util/String");

function OOC() {
	Command.call(this);

	this.regex = /^ooc (.+)/i

	this.execute = function(mob, message) {
		MUD.sendLine(String.format("{0} OOCs '{1}'", mob.display, message), MessageMode.CHAT, mob.player);
		mob.sendLine(String.format("You OOC '{0}'", message), MessageMode.COMMAND);
	}
}

OOC.prototype = new Command();

module.exports = OOC;
