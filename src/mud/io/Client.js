var events = require("events");

/**
 * Lowest level MUD client manager.
 * @param {net.socket} socket NodeJS client socket to manage.
 * @constructor
 * @extends EventEmitter
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

/**
 * The socket being managed by the client.
 * @type {net.socket}
 */
Client.prototype.socket = null;

/**
 * The socket's address.
 * @type {Object}
 */
Client.prototype.address = null;

/**
 * Playing being controlled by the client.
 * @type {net.socket}
 */
Client.prototype.player = null;


/**
 * Generate a string representing the client.
 * @default "client@" + plus the client's IP address
 * @return {String}
 */
Client.prototype.toString = function() {
	return "client@"+this.address.address;
}
/**
 * Assign player to client.
 * @param {Player?} player Player to associate with.
 */
Client.prototype.setPlayer = function(player) {
	if(this.player == player) return;

	if(this.player) {
		var oPlayer = this.player;
		this.player = null;
		oPlayer.setClient(null);
	}

	this.player = player;
	if(player) {
		player.setClient(this);
	}
}

Client.prototype.close = function() {
	this.socket.end();
	this.socket.destroy();
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
