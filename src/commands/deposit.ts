import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { SterlingEmbed, UserManager } from '../models'
import { prettyNum } from '../util'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deposit')
		.setDescription('Deposit money from your wallet to the bank')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('Amount of money to deposit')),

	async execute(interaction: CommandInteraction) {
		try {
			let user = await UserManager.getUser(interaction.user.id);
			let amount = (interaction.options.get('amount')?.value || user.data.wallet) as number;
			user.removeWallet(amount);
			user.addBank(amount);
			let sEmbed = SterlingEmbed.currency()
				.addFields(
					{ name: 'Deposited', value: `${prettyNum(amount)}`, inline: false },
					{ name: 'New Wallet Balance', value: `${prettyNum(user.data.wallet)}`, inline: true },
					{ name: 'New Bank Balance', value: `${prettyNum(user.data.bank)}`, inline: true },
				);
			await interaction.reply({
				embeds: [sEmbed.export()]
			});
		} catch (e) {
			const e2 = e as any;
			await interaction.reply({
				content: e2.toString()
			});
		}
	},
};