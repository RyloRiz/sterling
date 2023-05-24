import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { DisabledCommandEmbed, SterlingEmbed, UserManager } from '../models'
import { prettyNum } from '../util'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('See your total wallet and bank balance'),
	// .addUserOption(option =>
	// 	option
	// 		.setName('User')
	// 		.setDescription('User to see balance')),

	async execute(interaction: CommandInteraction) {
		return await interaction.reply({
			embeds: [DisabledCommandEmbed.export()]
		});
		let user = await UserManager.getUser(interaction.user.id);
		let sEmbed = SterlingEmbed.currency()
			.addFields(
				{ name: 'Wallet Balance', value: `${prettyNum(user.data.wallet)}`, inline: false },
				{ name: 'Bank Balance', value: `${prettyNum(user.data.bank)}`, inline: false },
			);
		await interaction.reply({
			embeds: [sEmbed.export()]
		});
	},
};