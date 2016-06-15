var net		= require("net");
var events	= require("events");
var Client	= require("./Client");

/**
 * Lowest level MUD server manager.
 * @constructor
 * @extends events.EventEmitter
 */
function Server() {
	events.EventEmitter.call(this);
	var __ = this;

	this.clients = [];

	__.on("connect", function(client) {
		__.clients.push(client);
	});

	__.on("disconnect", function(client) {
		var pos = __.clients.indexOf(client);
		if(pos == -1) {
			return;
		}

		__.clients.splice(pos,1);
	});
}

Server.prototype = new events.EventEmitter();

/**
 * The server's socket.
 * @type {net.socket}
 */
Server.prototype.socket = null;

/**
 * List of all clients connected to the server.
 * @type {Client[]}
 */
Server.prototype.clients = [];

/**
 * Open the server and begin listening for events.
 * @param {Number} port Port to begin listening on.
 */
Server.prototype.open = function(port) {
	var __ = this;

	this.socket = net.createServer(function(socket) {
		var client = new Client(socket, __);

		/**
		 * A new client has been connected.
		 * @event Server#connect
		 * @property {Client} client Client being connected.
		 */
		__.emit("connect", client);

		client.on("close", function() {
			/**
			 * A client has disconnected from the server.
			 * @event Server#disconnect
			 * @property {Client} client Client being disconnected.
			 */
			__.emit("disconnect", client);
		});
	});

	this.socket.on("listening", function() {
		/**
		 * The server is listening for new connections and data.
		 * @event Server#ready
		 */
		__.emit("ready");
	});

	this.socket.listen(port);
}

/**
 * Close the server and stop listening.
 */
Server.prototype.close = function() {
	var __ = this;

	this.socket.close(function() {
		__.emit("close");
	});
}

module.exports = Server;
