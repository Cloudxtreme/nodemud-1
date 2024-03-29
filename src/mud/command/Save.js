// local requires
var Command = require("../datum/Command");
var MUD = require("../MUD");
var Movable = require("../atom/Movable");
var MessageMode = require("../MessageMode");

function OOC() {
	Command.call(this);

	this.regex = /^save$/i

	this.execute = function(mob, message) {
		var obj = new Movable();
		obj.move(mob);
		console.log(mob.getJSON());
	}
}

OOC.prototype = new Command();

module.exports = OOC;
