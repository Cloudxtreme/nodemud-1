// local requires
var Database = require("./src/mud/Database");
var MUD = require("./src/mud/MUD");
var Logger = require("./src/mud/Database").logger;
var Server = require("./src/mud/io/Server");
require("./src/util/String");

// load the database first and foremost
Database.load();

// create and assign the game server
var s = new Server();
MUD.setServer(s);

// begin listening for the server's "ready" state
s.on("ready", function() {
	MUD.initialize();
	var address = this.socket.address();
	Logger.boot(String.format("Shit's open and ready to roll on port {0}.", address.port));
});

// open the server on the default port
var port = (process.argv.length>=3 && Number(process.argv[2]) != NaN ? Number(process.argv[2]) : Database.meta.defaultPort)
s.open(port);
