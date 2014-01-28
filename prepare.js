var child_process = require('child_process');
var config = require('./config.json');
var fs = require('fs');
var path = require('path');
var sleep = require('sleep');
var forever = require('forever-monitor');

var childProcesses = [];

for (var index in config.clients) {
	var client = config.clients[index];
	fs.writeFileSync(__dirname + "/config/" + client.slug + ".config.json", JSON.stringify(client));
}