var child_process = require('child_process');
var config = require('./config.json');
var fs = require('fs');
var path = require('path');
var sleep = require('sleep');
var forever = require('forever-monitor');

var pm2Config =[];
for (var index in config.clients) {
	var client = config.clients[index];
	fs.writeFileSync(__dirname + "/config/" + client.slug + ".config.json", JSON.stringify(client));
	
	var pm2Object = {
		"name": client.slug,
		"script": client.script || "/home/pi/canvas/canvas-client/app.js",
		"args": "['/home/pi/canvas/canvas-deploy/config/" + client.slug + ".config.json']",
		"error_file": "/home/pi/canvas/logs/" + client.slug + ".err.log",
		"out_file": "/home/pi/canvas/logs/" + client.slug + ".out.log",
		"user": "root"
	};
	pm2Config.push(pm2Object);
}

fs.writeFileSync(__dirname + "/pm2Config.json", JSON.stringify(pm2Config));