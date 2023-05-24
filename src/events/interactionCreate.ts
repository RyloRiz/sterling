import { Events, Interaction } from 'discord.js';
import { globals } from '../util';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) { // CommandInteraction
		if (interaction.client.settings.get('silentMode') === true && interaction.user.id !== globals.OWNER_ID) {
			console.log("Refused to fulfill request by", interaction.user.id);
			return null;
		}

		if (interaction.isButton()) {
			const button = interaction.client.buttons.get(interaction.customId);

			if (!button) {
				console.error(`No button matching ${interaction.customId} was found!`);
				return;
			}

			try {
				await button.execute(interaction);
			} catch (error) {
				console.error(`Error executing command ${interaction.customId}`);
				console.error(error);
			}
		} else if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found!`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing command ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isSelectMenu()) {
			const menu = interaction.client.menus.get(interaction.customId);

			if (!menu) {
				console.error(`No select menu matching ${interaction.customId} was found!`);
				return;
			}

			try {
				await menu.execute(interaction);
			} catch (error) {
				console.error(`Error executing select menu ${interaction.customId}`);
				console.error(error);
			}
		}
	},
};