var Movement = require("./Movement");
var MUD = require("../MUD");
var RealDirection = require("../RealDirection");

function West() {
	Movement.call(this);

	this.regex = /^w(e(s(t)?)?)?$/i
	this.direction = RealDirection.WEST;
}

West.prototype = new Movement();

module.exports = West;
