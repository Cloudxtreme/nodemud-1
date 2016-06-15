/**
 * Enum for player message modes.
 * @namespace
 */
var MessageMode = {
	/**
	 * Miscellaneous/uncategorized messages.
	 * @default 0
	 */
	MISC: 0,
	/**
	 * Command responses from input.
	 * @default 1
	 */
	COMMAND: 1,
	/**
	 * General chat messages.
	 * @default 2
	 */
	CHAT: 2,
	/**
	 * Combat messages.
	 * @default 3
	 */
	COMBAT: 3
};

module.exports = MessageMode;
