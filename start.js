var child_process = require('child_process');
var config = require('./config.json');
var fs = require('fs');
var sys = require('sys');
var path = require('path');
var sleep = require('sleep');

child_process.exec("pm2 stop all");
child_process.exec("pm2 delete all");

if (config.server) {
	console.log("starting server");
	child_process.exec("pm2 start " + __dirname + "/../canvas-server/app" + "--name server");
	sleep.sleep(5);
}

var pm2Processes = [];

for (var index in config.clients) {
	var client = config.clients[index];
	console.log("starting client",client);
	fs.writeFileSync("/tmp/" + client.slug + ".config.json", JSON.stringify(client));

	pm2Processes.push({
		name: client.slug,
		script: __dirname + '/../canvas-client/app.js',
		args: "['/tmp/" + client.slug + ".config.json']",
		error_file: __dirname + '/../logs/' + client.slug + '-err.log',
		out_file: __dirname + '/../logs/' + client.slug + '-out.log'
	});
}

fs.writeFileSync("/tmp/pm2Processes.json", JSON.stringify(pm2Processes));
child_process.exec("pm2 start /tmp/pm2Processes.json", function(err, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (err !== null) {
			console.log("exec error: " + error);
		}
});