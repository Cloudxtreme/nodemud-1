// local requires
var LogLevel = require("./LogLevel");

/** @namespace **/
var Log = {};

/**
 * Minimum log level.
 * @type {LogLevel}
 */
Log.minLog = LogLevel.INFO;

/**
 * Log a message.
 * @param {String} message Message to log.
 * @param {LogLevel?} level Level of the message.
 */
Log.log = function(message, level) {
	var d = new Date();
	var s = String.format("[{0}/{1}/{2} {3}:{4}:{5}] {6}", String.pad(""+(d.getMonth()+1), 2, "0"), String.pad(""+d.getDate(), 2, "0"), d.getFullYear(), String.pad(""+d.getHours(), 2, "0"), String.pad(""+d.getMinutes(), 2, "0"), String.pad(""+d.getSeconds(), 2, "0"), message);

	if((level == null && LogLevel.BASE >= Log.minLog) || level >= Log.minLog) {
		console.log(s);
	}
}

/**
 * Shortcut for logging error messages.
 * @param {String} message Message to log.
 */
Log.error = function(message) {
	Log.log(message, LogLevel.ERROR);
}

/**
 * Shortcut for logging debug messages.
 * @param {String} message Message to log.
 */
Log.debug = function(message) {
	Log.log(message, LogLevel.DEBUG);
}

/**
 * Shortcut for logging boot messages.
 * @param {String} message Message to log.
 */
Log.boot = function(message) {
	Log.log(message, LogLevel.BOOT);
}

/**
 * Shortcut for logging info messages.
 * @param {String} message Message to log.
 */
Log.info = function(message) {
	Log.log(message, LogLevel.INFO);
}

module.exports = Log;
