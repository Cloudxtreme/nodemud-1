// local requires
var Movement = require("./Movement");
var MUD = require("../MUD");
var RealDirection = require("../RealDirection");

function East() {
	Movement.call(this);

	this.regex = /^e(a(s(t)?)?)?$/i
	this.direction = RealDirection.EAST;
}

East.prototype = new Movement();

module.exports = East;
