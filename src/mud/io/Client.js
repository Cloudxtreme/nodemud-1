var events = require("events");

/**
 * Lowest level MUD client manager.
 * @param {net.socket} socket NodeJS client socket to manage.
 * @constructor
 * @extends events.EventEmitter
 */
function Client(socket) {
	events.EventEmitter.call(this);
	var __ = this;

	// initialize socket for standard processing
	socket.setEncoding("binary");

	socket.on("data", function(data) {
		/**
		 * The client has sent data.
		 * @event Client#data
		 * @property {String} data Data to send.
		 */
		__.emit("data", data);
	});

	socket.on("close", function() {
		/**
		 * The client has been closed on the client's side.
		 * @event Client#close
		 */
		__.emit("close");
	});

	this.socket = socket;
	this.address = socket.address();
	this.player = null;
}

Client.prototype = new events.EventEmitter();

Client.prototype.socket = null;
Client.prototype.address = null;
Client.prototype.player = null;

Client.prototype.toString = function() {
	return "client@"+this.address.address;
}
/**
 * Assign player to client.
 * @param {Player} player Player to associate with.
 */
Client.prototype.setPlayer = function(player) {
	this.player = player;
	if(player.client != this) {
		player.setClient(this);
	}
}

/**
 * Send string (no linefeed) to the client.
 * @param {String} string String to send.
 */
Client.prototype.send = function(string) {
	this.socket.write(string);
}

/**
 * Send string (with linefeed) to the client.
 * @param {String} string String to send.
 */
Client.prototype.sendLine = function(string) {
	this.socket.write(string+"\r\n");
}

module.exports = Client;
