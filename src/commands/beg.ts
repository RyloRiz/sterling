import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { SterlingEmbed, UserManager } from '../classes'
import { prettyNum, SterlingEmbedMode } from '../util'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg the locals for money'),

	async execute(interaction: CommandInteraction) {
		let user = await UserManager.getUser(interaction.user.id);
		let amount = Math.round(Math.random() * 100);
		user.addWallet(amount);
		let e = new SterlingEmbed({
			mode: SterlingEmbedMode.Currency
		});
		e.addFields(
			{ name: `You made:`, value: prettyNum(amount), inline: true },
		);
		await interaction.reply({
			embeds: [e.embed],
		});
	},
};