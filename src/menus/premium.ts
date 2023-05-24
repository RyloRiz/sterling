import { globals } from './../util/globals'
import { CacheType, SelectMenuInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SterlingEmbed } from '../models';
import { HexCodes, validateInteraction } from '../util'

module.exports = {
	data: {
		name: 'premium',
	},
	async execute(interaction: SelectMenuInteraction<CacheType>) {
		// Flow:
		// DM user asking for https://discord.gift link
		// Regex the link
		// User.subscribePremium();
		// interaction.channel?.send(interaction.user.username); // Person who selected from menu
		// interaction.channel?.send(interaction.message.author.username); // Bot
		// interaction.channel?.send(JSON.stringify(interaction.message.components[0])); // Junk
		// interaction.channel?.send(interaction.message.interaction?.user.username || 'None found'); // Initial author (yay)
		if (validateInteraction(interaction)) {
			let plan = interaction.values[0];
			let total = Number(plan.split('_')[0]);
			let paid = 0;

			const replyEmbed = SterlingEmbed.casual()
				.setDescription('Please follow the prompts in DMs to continue with the purchase')

			const initialEmbed = SterlingEmbed.casual()
				.setTitle('Send Your Discord Nitro Gift Links')
				.setDescription('If you have multiple gifts, please wait for an acknowledgement before sending the next gift.')
				.addFields(
					{ name: 'Gifts Paid:', value: (total - paid).toString(), inline: false },
					{ name: 'Gifts Remaining:', value: paid.toString() , inline: false }
			);

			const finishedEmbed = SterlingEmbed.casual()
				.setTitle('Purchase Successful')
				.setDescription('Thank you for buying Sterling Premium! Your donation is greatly appreciated by our hardworking developers.')
				.addFields(
					{ name: 'You Purchased', value: interaction.values[0].split('_').slice(1, 3).join(' ') + ' Premium', inline: false }
				);

			const row = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('stop_premium_collection')
						.setLabel('Cancel Purchase')
						.setStyle(ButtonStyle.Secondary),
				);

			function generateGiftEmbed(title?: string, desc?: string): SterlingEmbed {
				let e = SterlingEmbed.casual()
					.addFields(
						{ name: 'Gifts Paid:', value: (total - paid).toString(), inline: false },
						{ name: 'Gifts Remaining:', value: paid.toString(), inline: false }
					);
				if (title) {
					e.setTitle(title);
				}
				if (desc) {
					e.setDescription(desc);
				}
				return e;
			}

			await interaction.update({
				embeds: [replyEmbed.export()],
				components: [],
			});

			let dm = await interaction.user.createDM();
			dm.send({
				embeds: [initialEmbed.export()],
				components: [row]
			});

			const collector = dm.createMessageCollector({
				filter: m => m.author.bot === false,
				time: 1_000_000
			});

			interaction.client.once('sterling_stopPremiumCollection', async (id: string) => { // could put `reason` param
				if (interaction.user.id === id) {
					collector.stop('Remotely stopped (most likely due to user cancel)');
					interaction.client.emit(`sterling_stopPremiumCollection${interaction.user.id}`, interaction.values[0]);
					// dm.send({
					// 	embeds: [cancelEmbed.export()],
					// });
				}
			});

			// TODO: Never fires
			collector.on('collect', async (msg) => {
				console.log(JSON.stringify(msg).slice(0, 20));
				if (msg.author.bot) { return; }
				let matched = msg.content.match(/http(?:s?):\/\/discord.gift\/(.+)/);
				if (interaction.user.id === globals.OWNER_ID) {
					if (msg.content.includes('discord.gift/bypass')) {
						paid += 1;
						let giftEmbed = generateGiftEmbed('Gift Code Received', 'Your gift code has been received');
						dm.send({
							embeds: [giftEmbed.export()]
						});
						if (paid === total) {
							collector.stop('Purchase succeeded');
							dm.send({
								embeds: [finishedEmbed.export()]
							});
						}
					} else if (msg.content.includes('discord.gift/fail')) {
						let giftEmbed = generateGiftEmbed('Gift Code Invalid', 'Check if your gift code is up-to-date')
							.setColor(HexCodes.Yellow);
						dm.send({
							embeds: [giftEmbed.export()]
						});
					}
				} else if (matched) {
					let res = await fetch(`https://discord.com/api/v8/entitlements/gift-codes/${matched[1]}`, {
						method: 'GET'
					});
					let json = await res.json();
					if (json.message === "Unknown Gift Code") {
						let giftEmbed = generateGiftEmbed('Gift Code Invalid', 'Check if your gift code is up-to-date')
							.setColor(HexCodes.Yellow);
						dm.send({
							embeds: [giftEmbed.export()]
						});
					} else {
						paid += 1;
						let giftEmbed = generateGiftEmbed('Gift Code Received', 'Your gift code has been received');
						dm.send({
							embeds: [giftEmbed.export()]
						});
						if (paid === total) {
							collector.stop('Purchase succeeded');
							dm.send({
								embeds: [finishedEmbed.export()]
							});
						}
					}
				} else {
					let giftEmbed = generateGiftEmbed('Invalid Link', 'Check if your gift code link is correct')
						.setColor(HexCodes.Yellow);
					dm.send({
						embeds: [giftEmbed.export()]
					});
				}
			});
		}
	},
};