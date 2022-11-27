import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } from 'discord.js';
import { SterlingEmbed, UserManager } from '../classes';
import { globals, SterlingEmbedMode } from '../util'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Developer debug command (owner-only)')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction: CommandInteraction) {
		if (interaction.user?.id == globals.OWNER_ID) {
			const e = new SterlingEmbed({
				mode: SterlingEmbedMode.Developer
			});
			e.addFields(
				{ name: 'User Pool', value: Object.keys(UserManager.users).length.toString(), inline: true },
			);
			await interaction.reply({
				embeds: [e.embed]
			});
		} else {
			await interaction.reply({
				content: 'You do not have permission to run this command!'
			});
		}
	},
};