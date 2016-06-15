// local requires
var Movement = require("./Movement");
var MUD = require("../MUD");
var RealDirection = require("../RealDirection");

function North() {
	Movement.call(this);

	this.regex = /^n(o(r(t(h)?)?)?)?$/i
	this.direction = RealDirection.NORTH;
}

North.prototype = new Movement();

module.exports = North;
