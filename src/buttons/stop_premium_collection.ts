import { ButtonInteraction, CacheType } from "discord.js";
import { SterlingEmbed } from '../models';
import { HexCodes, validateInteraction } from '../util'

module.exports = {
	data: {
		name: 'stop_premium_collection'
	},
	async execute(interaction: ButtonInteraction<CacheType>) {
		interaction.client.once(`sterling_stopPremiumCollection${interaction.user.id}`, async (value: string) => {
			const cancelEmbed = SterlingEmbed.casual()
				.setColor(HexCodes.Orange)
				.setTitle('Purchase Cancelled')
				.setDescription(`Your purchase of "${value.split('_').slice(1, 3).join(' ') + ' Premium'}" was cancelled`);
			interaction.update({
				embeds: [cancelEmbed.export()],
				components: []
			});
		});
		interaction.client.emit('sterling_stopPremiumCollection', interaction.user.id);
	}
}