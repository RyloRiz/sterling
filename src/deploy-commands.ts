import dotenv from 'dotenv'
dotenv.config();

import fs from 'node:fs'
import { REST, Routes } from 'discord.js'

const { CLIENTID, TOKEN } = process.env;
const GUILD_COMMANDS: any = {
	journal: '961164418866085909'
};

interface GCS {
	[k: string]: GuildCommands;
}

interface GuildCommands {
	commands: any[];
	id: string;
	names: string[];
}

const commands = [];
const commandNames = [];
const guildCommands: GCS = {};
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	if (file.startsWith('@')) {
		const gCommand = require(`${__dirname}/commands/${file}`);
		const trimmedName = file.slice(1).split('_')[0];
		if (guildCommands[trimmedName] == null) {
			guildCommands[trimmedName] = {
				commands: [],
				id: GUILD_COMMANDS[trimmedName],
				names: [],
			}
		}
		let gcs = guildCommands[trimmedName];
		gcs.commands.push(gCommand.data.toJSON());
		gcs.names.push(trimmedName);
	} else {
		const command = require(`${__dirname}/commands/${file}`);
		commands.push(command.data.toJSON());
		commandNames.push(file);
	}
}

const rest = new REST({ version: '10' }).setToken(TOKEN as string);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			// Routes.applicationGuildCommands(CLIENTID as string, GUILDID as string),
			Routes.applicationCommands(CLIENTID as string),
			{ body: commands },
		);

		for (const [k, gcs] of Object.entries(guildCommands)) {
			console.log(`Started refreshing ${gcs.commands.length} guild (/) commands.`);

			const gdata = await rest.put(
				Routes.applicationGuildCommands(CLIENTID as string, gcs.id as string),
				{ body: gcs.commands },
			);

			gcs.names.forEach(f => console.log(`Refreshed ${f} (/) command.`));
			console.log(`Successfully reloaded ${(gdata as any).length} guild (/) commands.`);
		}

		commandNames.forEach(f => console.log(`Refreshed ${f} (/) command.`));
		console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
		process.exit();
	} catch (error) {
		console.error(error);
	}
})();