/**
 * Objects used for command processing.
 * @constructor
 */
function Command() {
}

/** Regular expressions for matching this command. */
Command.prototype.regex = null;

/**
 * Should this command be loaded?
 * @type {boolean}
 * @default true
 */
Command.prototype.load = true;

/**
 * Match a string to this command's regex rule.
 * @param {Mob} mob Mob testing the command.
 * @param {String} string String to test.
 * @return {boolean}
 */
Command.prototype.match = function(mob, str) {
	return this.regex.test(str);
}

/**
 * Process and format input for the command.<br/><br/>
 * <b>Calls Command.execute() with properly formatted/parsed arguments.</b>
 * @param {Mob} mob Mob using the command.
 * @param {String} string String to format.
 */
Command.prototype.process = function(mob, str) {
	var args = this.regex.exec(str);
	args = Array.prototype.slice.call(args);
	args.splice(0,1); // remove full command
	args.unshift(mob); // add mob as first argument
	this.execute.apply(this, args);
}

/**
 * Execute command.
 * @param {Mob} mob Mob using the command.
 */
Command.prototype.execute = function(mob) {
}

module.exports = Command;
