var control = require('control'),
	task = control.task;

function configure(hostname, address, sshPort) {
	var controller = Object.create(control.controller);

	controller.user = 'pi';
	controller.sshOptions = ['-p ' + sshPort];
	controller.scpOptions = ['-P ' + sshPort, '-r'];
	controller.address = address;
	controller.localDir = "./" + hostname;
	controller.remoteDir = "/home/pi/canvas";
	controller.hostname = hostname;
	controller.config = require("./config." + hostname + ".json");

	return [controller];
}

task('vincent', 'Config for vincent', function() {
	return configure('vincent', 'taylorsavage.com', '2219');
});

task('pablo', 'Config for pablo', function() {
	return configure('pablo', 'taylorsavage.com', '2221');
});

task('claude', 'Config for claude', function() {
	return configure('claude', 'taylorsavage.com', '2222');
});

task('pablo-eth', 'Config for pablo over ethernet', function() {
	return configure('pablo', 'taylorsavage.com', '2220');
});

task('deploy', 'Deploy a machine', function(controller) {
	controller.ssh("cd /home/pi/canvas/canvas-deploy && git pull origin master && npm install", function() {
		controller.ssh("cd /home/pi/canvas/canvas-client && git pull origin master && npm install", function() {
			controller.ssh("cd /home/pi/canvas/canvas-server && git pull origin master && npm install", function() {
				controller.scp("./config." + controller.hostname + ".json", "/home/pi/canvas/canvas-deploy/config.json", function() {
					controller.ssh("node /home/pi/canvas/canvas-deploy/prepare.js", function() {
						controller.ssh("sudo forever restartall");
					});
				});
			});
		});
	});
});

control.begin();