import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addBooleanOption(option =>
			option
				.setName('ephemeral')
				.setDescription('Whether or not to make this view-only by yourself')),

	async execute(interaction: CommandInteraction) {
		await interaction.reply({
			content: 'Pong!',
			ephemeral: interaction.options.get('ephemeral')?.value as boolean || false
		});
	},
};