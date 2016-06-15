var Database = require("./src/mud/Database");
var MUD = require("./src/mud/MUD");
var Log = require("./src/mud/Log");
var Server = require("./src/mud/io/Server");

// load the database first and foremost
Database.load();

// create and assign the game server
var s = new Server();
MUD.setServer(s);

// begin listening for the server's "ready" state
s.on("ready", function() {
	MUD.initialize();
	Log.boot("Shit's open and ready ay.");
});

// open the server on the default port
s.open(8000);
