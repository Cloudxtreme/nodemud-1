var Movement = require("./Movement");
var MUD = require("../MUD");
var RealDirection = require("../RealDirection");

function South() {
	Movement.call(this);

	this.regex = /^s(o(u(t(h)?)?)?)?$/i
	this.direction = RealDirection.SOUTH;
}

South.prototype = new Movement();

module.exports = South;
