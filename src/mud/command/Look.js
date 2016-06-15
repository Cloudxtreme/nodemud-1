// local requires
var Command = require("../datum/Command");
var MUD = require("../MUD");
var Mappable = require("../atom/Mappable");

function Look() {
	Command.call(this);

	this.regex = /^look$/i

	this.execute = function(mob) {
		mob.showRoom();
	}
}

Look.prototype = new Command();

module.exports = Look;
