import dotenv from 'dotenv'
dotenv.config();

import fs from 'node:fs'
import { REST, Routes } from 'discord.js'

const { CLIENTID, TOKEN } = process.env;

const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${__dirname}/commands/${file}`);
	commands.push(command.data.toJSON());
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

		console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();