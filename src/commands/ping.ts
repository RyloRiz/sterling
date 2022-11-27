import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addBooleanOption(option =>
			option
				.setName('ephemeral')
				.setDescription('Whether or not to make the response private to you')),

	async execute(interaction: CommandInteraction) {
		await interaction.reply({
			content: 'Pong!',
			ephemeral: interaction.options.get('ephemeral')?.value as boolean || false
		});
	},
};