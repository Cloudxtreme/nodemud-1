var Database = require("./src/mud/Database");
var MUD = require("./src/mud/MUD");
var Log = require("./src/mud/Log");
var Server = require("./src/mud/io/Server");


Database.load();

var s = new Server();
MUD.setServer(s);

s.on("ready", function() {
	MUD.initialize();
	Log.boot("Shit's open and ready ay.");
});

s.open(8000);
