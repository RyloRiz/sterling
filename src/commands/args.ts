import { SlashCommandBuilder, CommandInteraction, italic } from 'discord.js';
import { SterlingEmbed } from '../models';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('args')
		.setDescription('Test slash command arguments')
		.addAttachmentOption(option =>
			option
				.setName('attachment')
				.setDescription('An argument that accepts an attachment')
				.setRequired(false))
		.addBooleanOption(option =>
			option
				.setName('boolean')
				.setDescription('An argument that accepts a boolean')
				.setRequired(false))
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('An argument that accepts a channel')
				.setRequired(false))
		.addIntegerOption(option =>
			option
				.setName('integer')
				.setDescription('An argument that accepts an integer (only whole numbers, use "number" for decimals)')
				.setRequired(false))
		.addMentionableOption(option =>
			option
				.setName('mentionable')
				.setDescription('An argument that accepts a mentionable object')
				.setRequired(false))
		.addNumberOption(option =>
			option
				.setName('number')
				.setDescription('An argument that accepts a number (decimals included)')
				.setRequired(false))
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('An argument that accepts a role')
				.setRequired(false))
		.addStringOption(option =>
			option
				.setName('string')
				.setDescription('An argument that accepts a string')
				.setRequired(false))
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('An argument that accepts a user')
				.setRequired(false))
		,

	async execute(interaction: CommandInteraction) {
		const attachment = interaction.options.get('attachment')?.value;
		const boolean = interaction.options.get('boolean')?.value;
		const channel = interaction.options.get('channel')?.value;
		const integer = interaction.options.get('integer')?.value;
		const mentionable = interaction.options.get('mentionable')?.value;
		const number = interaction.options.get('number')?.value;
		const role = interaction.options.get('role')?.value;
		const string = interaction.options.get('string')?.value;
		const user = interaction.options.get('user')?.value;
		const user2 = interaction.options.getUser('user');
		const user3 = interaction.options.getMember('user');
		const embed = SterlingEmbed.casual()
			.setDescription(`Here's what I found:`)
			.addFields(
				{ name: 'Attachment', value: attachment ? italic('Found') : italic('Not found'), inline: true },
				{ name: 'Boolean', value: boolean ? boolean.toString() : italic('Not found'), inline: true },
				{ name: 'Channel', value: channel ? channel.toString() : italic('Not found'), inline: true },
			)
			.addBlankField()
			.addFields(
				{ name: 'Integer', value: integer ? integer.toString() : italic('Not found'), inline: true },
				{ name: 'Mentionable', value: mentionable ? mentionable.toString() : italic('Not found'), inline: true },
				{ name: 'Number', value: number ? number.toString() : italic('Not found'), inline: true },
			)
			.addBlankField()
			.addFields(
				{ name: 'Role', value: role ? role.toString() : italic('Not found'), inline: true },
				{ name: 'String', value: string ? string.toString() : italic('Not found'), inline: true },
				{ name: 'User', value: user ? user.toString() : italic('Not found'), inline: true },
			)
			.addBlankField()
			.addFields(
				{ name: 'User (Type 2)', value: (user2 && user3) ? `${user2.toString()}|${user3.toString()}` : italic('Not found'), inline: true },
			);
		await interaction.reply({
			embeds: [embed.export()]
		});
	},
};