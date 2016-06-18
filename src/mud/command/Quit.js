// local requires
var Command = require("../datum/Command");
var MUD = require("../MUD");
var RealDirection = require("../RealDirection");
var MessageMode = require("../MessageMode");

function Quit() {
	Command.call(this);

	this.regex = /^quit$/i
}

Quit.prototype = new Command();

Quit.prototype.execute = function(mob) {
	var player = mob.getPlayer();
	if(!player) {
		mob.sendMessage("You're not a player...", MessageMode.COMMAND);
		return
	}

	player.logout();
}

module.exports = Quit;
