/**
 * Enum for log levels.
 * @namespace
 */
var LogLevel = {
	/**
	 * Error messages.
	 * @default 0
	 */
	ERROR:	10,
	/**
	 * Debug messages.
	 * @default 0
	 */
	DEBUG:	9,
	/**
	 * Boot messages.
	 * @default 0
	 */
	BOOT:	8,
	/**
	 * Generic log messages.
	 * @default 0
	 */
	BASE:	0,
	/**
	 * User commands, etc...
	 * @default 0
	 */
	INFO:	-10
}

module.exports = LogLevel;
