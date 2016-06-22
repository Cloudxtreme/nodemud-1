// local requires
var LogLevel = require("../LogLevel");

/**
 * Object that handles the logging of data.
 * @constructor
 */
function Logger() {
}

/**
 * Minimum log level.
 * @type {LogLevel}
 */
Logger.prototype.minLog = LogLevel.INFO;

/**
 * Log a message.
 * @param {String} message Message to log.
 * @param {LogLevel?} level Level of the message.
 */
Logger.prototype.log = function(message, level) {
	var d = new Date();
	var s = String.format("[{0}/{1}/{2} {3}:{4}:{5}] {6}", String.pad(""+(d.getMonth()+1), 2, "0"), String.pad(""+d.getDate(), 2, "0"), d.getFullYear(), String.pad(""+d.getHours(), 2, "0"), String.pad(""+d.getMinutes(), 2, "0"), String.pad(""+d.getSeconds(), 2, "0"), message);

	if((level == null && LogLevel.BASE >= this.minLog) || level >= this.minLog) {
		console.log(s);
	}
}

/**
 * Shortcut for logging error messages.
 * @param {String} message Message to log.
 */
Logger.prototype.error = function(message) {
	this.log(message, LogLevel.ERROR);
}

/**
 * Shortcut for logging debug messages.
 * @param {String} message Message to log.
 */
Logger.prototype.debug = function(message) {
	this.log(message, LogLevel.DEBUG);
}

/**
 * Shortcut for logging boot messages.
 * @param {String} message Message to log.
 */
Logger.prototype.boot = function(message) {
	this.log(message, LogLevel.BOOT);
}

/**
 * Shortcut for logging info messages.
 * @param {String} message Message to log.
 */
Logger.prototype.info = function(message) {
	this.log(message, LogLevel.INFO);
}

module.exports = Logger;
