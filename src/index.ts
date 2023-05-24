import dotenv from 'dotenv'
dotenv.config();

import fs from 'node:fs';
import path from 'node:path';
import { ActivityType, Client, Collection, Events, GatewayIntentBits, PresenceUpdateStatus } from 'discord.js';
const { TOKEN } = process.env;

declare module "discord.js" {
	export interface Client {
		buttons: Collection<unknown, any>,
		commands: Collection<unknown, any>,
		menus: Collection<unknown, any>,
		settings: Map<string, any>,
	}
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds
	]
});

// Map<{ guildId: targetChannelId }>
const _backdoorMode = new Map<string, string>();

client.buttons = new Collection();
client.commands = new Collection();
client.menus = new Collection();
client.settings = new Map<string, any>();

client.settings.set('backdoorMode', _backdoorMode);
client.settings.set('backdoorLogging', {
	guildId: '1043622457153703998',
});
client.settings.set('silentMode', true);

const buttonsPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
	const filePath = path.join(buttonsPath, file);
	const button = require(filePath);
	if ('data' in button && 'execute' in button) {
		client.buttons.set(button.data.name, button);
	} else {
		console.log(`[WARNING] The button at ${filePath} is missing a required "execute" property.`);
	}
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const menusPath = path.join(__dirname, 'menus');
const menuFiles = fs.readdirSync(menusPath).filter(file => file.endsWith('.js'));

for (const file of menuFiles) {
	const filePath = path.join(menusPath, file);
	const menu = require(filePath);
	if ('data' in menu && 'execute' in menu) {
		client.menus.set(menu.data.name, menu);
	} else {
		console.log(`[WARNING] The select menu at ${filePath} is missing a required "execute" property.`);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(TOKEN)
	.then((token) => {
		// client.user?.setPresence({
		// 	activities: [
		// 		{ name: '/help', type: ActivityType.Listening }
		// 	],
		// 	status: PresenceUpdateStatus.Online,
		// });
		client.user?.setPresence({
			status: PresenceUpdateStatus.Invisible,
		});
	});

/*
https://discord.com/api/oauth2/authorize?client_id=1044561491329826858&permissions=8&scope=bot%20applications.commands
*/