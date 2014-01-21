var child_process = require('child_process');
var config = require('./config.json');
var fs = require('fs');
var path = require('path');
var sleep = require('sleep');

var childProcesses = [];

if (config.server) {
	console.log("starting server");
	childProcesses.push(child_process.fork(__dirname + "/../canvas-server/app"));
	sleep.sleep(5);
}

for (var index in config.clients) {
	var client = config.clients[index];
	console.log("starting client",client);
	fs.writeFile("/tmp/" + client.slug + ".config.json", JSON.stringify(client));
	childProcesses.push(child_process.fork(__dirname + '/../canvas-client/app', ['/tmp/' + client.slug + '.config.json']));
}