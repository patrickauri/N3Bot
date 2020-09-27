const Discord = require('discord.js');
const request = require('request');
require('dotenv').config();
const client = new Discord.Client();

const token = process.env.TOKEN;
let msg = null;
const botChannel = '759888425292922910';
const welcomeChannel = '585141902311948292';

const roles = [ [ 'amongus', '759805495199400006' ] ];

const RandomArrayElement = (a) => {
	return a[Math.floor(Math.random() * a.length)];
};

const isCommand = (msg) => {
	return msg[0] === '.';
};

const parseCommand = (msg) => {
	const space = msg.indexOf(' ');
	let command;
	let content;
	let cmd = {};
	if (space === -1) {
		command = msg.substr(1, msg.length);
		cmd = { command, content };
	} else {
		command = msg.substr(1, space - 1);
		content = msg.substr(space + 1, msg.length);
		cmd = { command, content };
	}
	return cmd;
};

const GetRoleID = (roleName) => {
	let found = false;
	let result;
	for (let i = 0; i < roles.length && found === false; i++) {
		if (roles[i][0] === roleName) {
			result = roles[i][1];
			found = true;
		}
	}
	return found === true ? result : null;
};

const GetRoleName = (msg, role) => {
	return msg.guild.roles.cache.find((r) => r.id === GetRoleID(role)).name;
};

const AddRole = (msg, role, mute) => {
	if (msg.member.roles.cache.some((r) => r.id === GetRoleID(role))) {
		RemoveRole(msg, role, mute);
	} else {
		msg.member.roles.add(GetRoleID(role));
		const roleName = msg.guild.roles.cache.find((r) => r.id === GetRoleID(role)).name;
		if (!mute) {
			const reply = `You've been given the role: **${roleName}**`;
			msg.channel.send(reply);
		}
		console.log(`Added Role ${roleName} to user: ${msg.member.user.username}`);
	}
};

const RemoveRole = (msg, role, mute) => {
	msg.member.roles.remove(GetRoleID(role));
	const roleName = msg.guild.roles.cache.find((r) => r.id === GetRoleID(role)).name;
	if (!mute) {
		const reply = `Removed role: **${roleName}**`;
		msg.channel.send(reply);
	}
	console.log(`Removed Role ${roleName} from user: ${msg.member.user.username}`);
};

const AddAndRemoveRoles = (msg, addRole, removeRoles) => {
	removeRoles.forEach((r) => {
		RemoveRole(msg, r, true);
	});
	AddRole(msg, addRole);
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (msg) => {
	if (isCommand(msg.content)) {
		const cmd = parseCommand(msg.content);
		if (cmd.command === 'help') {
			//Help
		}
		// Only perform role changes in the bot channel
		if (msg.channel.id === botChannel) {
			switch (cmd.command) {
				case 'amongus':
					AddRole(msg, 'amongus');
					break;
			}
		}
	}
});

client.on('guildMemberAdd', (member) => {
	const welcomeMsg = [ `${member} has joined the server 👏` ];
	const channel = member.guild.channels.cache.find((ch) => ch.id === welcomeChannel);
	channel.send(RandomArrayElement(welcomeMsg));
});

client.login(token);
