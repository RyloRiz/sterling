import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { DisabledCommandEmbed, SterlingEmbed, UserManager } from '../models'
import { prettyNum } from '../util'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg the locals for money'),

	async execute(interaction: CommandInteraction) {
		return await interaction.reply({
			embeds: [DisabledCommandEmbed.export()]
		});
		let user = await UserManager.getUser(interaction.user.id);
		let amount = Math.round(Math.random() * 100);
		user.addWallet(amount);
		let e = SterlingEmbed.currency()
			.addFields(
				{ name: `You made:`, value: `${prettyNum(amount)}`, inline: true },
			);
		await interaction.reply({
			embeds: [e.export()],
		});
	},
};