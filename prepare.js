var child_process = require('child_process');
var config = require('./config.json');
var fs = require('fs');
var path = require('path');
var sleep = require('sleep');
var forever = require('forever-monitor');

var startString = "";
for (var index in config.clients) {
	var client = config.clients[index];
	fs.writeFileSync(__dirname + "/config/" + client.slug + ".config.json", JSON.stringify(client));
	startString += "forever start /home/pi/canvas/canvas-client/app.js /home/pi/canvas/canvas-deploy/config/" + client.slug + ".config.json -o /home/pi/canvas/logs/" + client.slug + "_out.log -e /home/pi/canvas/logs/" + client.slug + "_err.log;  ";
}

fs.writeFileSync(__dirname + "/start.sh", startString);