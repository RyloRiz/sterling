import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { HexCodes } from '../util';
import { SterlingEmbed } from '../models';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickname')
		.setDescription('Set your nickname')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('Leave empty to reset nickname'))
		.setDMPermission(false),

	async execute(interaction: CommandInteraction) {
		const nickname = interaction.options.get('name')?.value as string || '';
		let m = await interaction.guild?.members.fetch(interaction.member?.user.id as string);
		if (m) {
			// const oldName = m?.nickname || m?.user.username;
			let newMember = await m?.setNickname(nickname.length > 0 ? nickname : null, "[STERLING] User ran '/nickname' command");
			// const newName = newMember?.nickname || newMember?.user.username;
			let e: SterlingEmbed;
			if (newMember?.nickname === nickname) {
				e = SterlingEmbed.casual()
					.setDescription(`Nickname updated to "${nickname}"`);
			} else /*if (oldName === newName)*/ {
				e = SterlingEmbed.casual()
					.setColor(HexCodes.Orange)
					.setDescription(`Nickname failed to update`);
			}
			await interaction.reply({
				embeds: [e.export()]
			});
		} else {
			const errorE = SterlingEmbed.casual()
				.setColor(HexCodes.Orange)
				.setDescription(`Unable to find ${interaction.user.username}#${interaction.user.discriminator} in this server`);
			await interaction.reply({
				embeds: [errorE.export()]
			});
		}
	},
};