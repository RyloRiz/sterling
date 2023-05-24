import { ButtonInteraction, CacheType, SelectMenuInteraction } from 'discord.js'
import { SterlingEmbed } from '../models';

export function incrementDateByOneMonth(d: Date) {
	if (d.getMonth() == 11) {
		return new Date(d.getFullYear() + 1, 0, 1);
	} else {
		return new Date(d.getFullYear(), d.getMonth() + 1, 1);
	}
}

export function prettyNum(x: number) {
	return '◎' + (x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

export function validateInteraction(interaction: SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType>): boolean {
	if (interaction.user.id !== interaction.message.interaction?.user.id) {
		const embed = SterlingEmbed.barebones()
			.setDescription('You do not own this command!');

		interaction.reply({
			embeds: [embed.export()],
			ephemeral: true,
		});
		return false;
	} else {
		return true;
	}
}