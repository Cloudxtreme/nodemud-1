// local requires
var Command = require("../datum/Command");
var MUD = require("../MUD");
var RealDirection = require("../RealDirection");
var MessageMode = require("../MessageMode");

function Movement() {
	Command.call(this);

	this.direction = RealDirection.NORTH;

	this.execute = function(mob) {
		if(!mob.step(this.direction)) {
			mob.sendLine("You cannot go that way.", MessageMode.COMMAND);
		}
	}
}

Movement.prototype = new Command();

module.exports = Movement;
