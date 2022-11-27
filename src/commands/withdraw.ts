import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { SterlingEmbed, UserManager } from '../classes'
import { prettyNum, SterlingEmbedMode } from '../util'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('withdraw')
		.setDescription('Withdraw money from the bank to your wallet')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('Amount of money to withdraw')),

	async execute(interaction: CommandInteraction) {
		let user = await UserManager.getUser(interaction.user.id);
		let amount = (interaction.options.get('amount')?.value || user.data.bank) as number;
		user.removeBank(amount);
		user.addWallet(amount);
		let sEmbed = new SterlingEmbed({
			debug: true,
			debugInfo: user.consumedCapacity,
			mode: SterlingEmbedMode.Currency
		})
			.addFields(
				{ name: 'Withdrew', value: `💰${prettyNum(amount)}`, inline: false },
				{ name: 'New Wallet Balance', value: `💰${prettyNum(user.data.wallet)}`, inline: false },
				{ name: 'New Bank Balance', value: `💰${prettyNum(user.data.bank)}`, inline: true },
			);
		await interaction.reply({
			embeds: [sEmbed.embed]
		});
	},
};