import { SlashCommandBuilder, CommandInteraction, User, GuildMember, ChannelType, PermissionsBitField, CategoryChannel, ChatInputCommandInteraction } from 'discord.js';
import { HexCodes } from '../util';
import { SterlingEmbed } from '../models';
import { globals } from '../util'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('journal')
		.setDescription('Create a journal for a person')
		.addUserOption(option =>
			option
				.setName('person')
				.setDescription('The member to create a journal for')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The name of the person to create a journal for')
				.setRequired(true))
		.setDMPermission(false),

	async execute(interaction: ChatInputCommandInteraction) {
		const person = interaction.options.getUser('person');
		const name = interaction.options.getString('name');
		if (person) {
			const initiator = interaction.member as GuildMember;

			if (initiator.permissions.has(PermissionsBitField.Flags.Administrator) || initiator.id === globals.OWNER_ID) {
				const roles = await interaction.guild?.roles.fetch();
				const memberRole = roles?.find(role => role.id === "961170074885046272" && role.managed === false);

				if (memberRole) {
					const guildPerson = await interaction.guild?.members.fetch(person);
					if (guildPerson?.roles.cache.find(role => role.id === '961170074885046272')) {
						console.log(`Member role already exists on ${person.username}#${person.discriminator}`);
					} else {
						guildPerson?.roles.add(memberRole);
					}

					const category = await interaction.guild?.channels.fetch('961532100413095946') as CategoryChannel;
					const channel = await interaction.guild?.channels.create({
						name: `ೃ-${name}’s-journal`,
						type: ChannelType.GuildText,
						reason: `Sterling created a journal for ${name} requested by ${initiator.displayName}`
					});
					await channel?.setParent(category);

					await channel?.send({
						content: `<@${person.id}>, welcome to your journal!`
					});
				} else {
					const errorE = SterlingEmbed.casual()
						.setColor(HexCodes.Orange)
						.setDescription(`Member role could not be found! (This is most likely an internal error)`);
					await interaction.reply({
						embeds: [errorE.export()]
					});
				}
			} else {
				const errorE = SterlingEmbed.casual()
					.setColor(HexCodes.Orange)
					.setDescription(`You do not have permission to run this command! Only admins can create journals.`);
				await interaction.reply({
					embeds: [errorE.export()]
				});
			}
		} else {
			const errorE = SterlingEmbed.casual()
				.setColor(HexCodes.Orange)
				.setDescription(`Person was not provided or does not exist`);
			await interaction.reply({
				embeds: [errorE.export()]
			});
		}
	},
};