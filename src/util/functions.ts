import { ButtonInteraction, CacheType, ChatInputCommandInteraction, SelectMenuInteraction } from 'discord.js'
import { SterlingEmbed } from '../models';
import { HexCodes } from './enum';

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

export function unsupportedCommand(interaction: ChatInputCommandInteraction): void {
	const embed = SterlingEmbed.casual()
		.setColor(HexCodes.Orange)
		.setTitle('Unsupported Command')
		.setDescription('This command is either unsupported or unfinished. Check again later!');
	interaction.reply({
		embeds: [embed.export()]
	});
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