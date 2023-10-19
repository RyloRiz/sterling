import { globals } from './../util/globals'
import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, User, GuildMember, TextChannel, PermissionFlagsBits, userMention } from 'discord.js';
import { HexCodes, ACCESS_DATABASE, unsupportedCommand } from '../util';
import { SterlingEmbed } from '../models';

/*
value realtime
00 12am
01 1
02 2
03 3
04 4
11 11
12 12pm
13 1
14 2
15 3

/access grant <iden: string> <member: GuildMember>
/access request <iden: string> [reason: string]
/access revoke [iden: string = iden(this.channel)] [member: GuildMember = interaction.member]
/access start <channel: GuildChannel<GuildText>> <iden: string> [owner: GuildMember = interaction.member] [timeout: Time]
/access stop <iden: string>

*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('access')
		.setDescription('Manage, request, & revoke access to managed private channels')
		.addSubcommand(subcmd =>
			subcmd
				.setName('grant')
				.setDescription('Grant access to a managed private access channel')
				.addStringOption(option =>
					option
						.setName('iden')
						.setDescription('The identifier for this managed channel (3-15 chars)')
						.setMinLength(3)
						.setMaxLength(15)
						.setRequired(true)
				)
				.addUserOption(option =>
					option
						.setName('member')
						.setDescription('The member to grant access to')
						.setRequired(true)
				)
		)
		.addSubcommand(subcmd =>
			subcmd
				.setName('request')
				.setDescription('Request access to a managed private access channel')
				.addStringOption(option =>
					option
						.setName('iden')
						.setDescription('The identifier for this managed channel (3-15 chars)')
						.setMinLength(3)
						.setMaxLength(15)
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('reason')
						.setDescription('Reason for requesting access')
						.setRequired(false)
				)
		)
		.addSubcommand(subcmd =>
			subcmd
				.setName('revoke')
				.setDescription('Revoke access to a private access channel')
				.addStringOption(option =>
					option
						.setName('iden')
						.setDescription('The identifier for this managed channel (3-15 chars)')
						.setMinLength(3)
						.setMaxLength(15)
						.setRequired(true)
				)
				.addUserOption(option =>
					option
						.setName('member')
						.setDescription('The member to revoke access from (default: you)')
						.setRequired(false)
				)
		)
		.addSubcommand(subcmd =>
			subcmd
				.setName('start')
				.setDescription('Start a new managed private access channel')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to manage')
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('iden')
						.setDescription('The identifier for this managed channel (3-15 chars)')
						.setMinLength(3)
						.setMaxLength(15)
						.setRequired(true)
				)
				.addUserOption(option =>
					option
						.setName('owner')
						.setDescription('The owner of this managed channel (default: you)')
						.setRequired(false)
				)
				.addStringOption(option =>
					option
						.setName('timeout')
						.setDescription('The time (PST) to auto-revoke access to all members daily - "HH:MM" (HH=00-23 & MM=00-59)')
						.setRequired(false)
				)
		)
		.addSubcommand(subcmd =>
			subcmd
				.setName('stop')
				.setDescription('Stop managing a private access channel')
				.addStringOption(option =>
					option
						.setName('iden')
						.setDescription('The identifier for this managed channel (3-15 chars)')
						.setMinLength(3)
						.setMaxLength(15)
						.setRequired(true)
				)
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const subcmd = interaction.options.getSubcommand();
		const initiator = await interaction.guild?.members.fetch(interaction.member?.user.id as string);

		if (subcmd === 'grant') {
			const iden = interaction.options.getString('iden') as string;
			const user = interaction.options.getUser('member') as User;
			const member = await interaction.guild?.members.fetch(user) as GuildMember;

			const ACCESS_DATA = ACCESS_DATABASE[iden];

			if (ACCESS_DATA) {
				const channel = await interaction.guild?.channels.fetch(ACCESS_DATA.channel_id) as TextChannel;
				await channel.edit({
					permissionOverwrites: [
						{
							id: member.id,
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
						},
						{
							id: interaction.guild?.roles.everyone.id as string,
							deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
						}
					]
				});

				const e = SterlingEmbed.casual()
					.setColor(HexCodes.Green)
					.setTitle('Access Granted')
					.setDescription(`Access to private channel "${iden}" was granted to ${userMention(member.id)}`);
				interaction.reply({
					embeds: [e.export()]
				});
			} else {
				const e = SterlingEmbed.casual()
					.setColor(HexCodes.Yellow)
					.setTitle('Access Identifier Error')
					.setDescription(`Identifier "${iden}" does not exist!`);
				interaction.reply({
					embeds: [e.export()]
				});
			}
		} else if (subcmd === 'request') {
			unsupportedCommand(interaction);
		} else if (subcmd === 'revoke') {
			const iden = interaction.options.getString('iden') as string;
			let user = interaction.options.getUser('member');
			let member: GuildMember;
			if (user) {
				member = await interaction.guild?.members.fetch(user) as GuildMember;
			} else {
				member = initiator as GuildMember;
			}

			const ACCESS_DATA = ACCESS_DATABASE[iden];

			if (ACCESS_DATA) {
				const channel = await interaction.guild?.channels.fetch(ACCESS_DATA.channel_id) as TextChannel;
				await channel.edit({
					permissionOverwrites: [
						{
							id: member.id,
							deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
						},
						{
							id: interaction.guild?.roles.everyone.id as string,
							deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
						}
					]
				});

				const e = SterlingEmbed.casual()
					.setColor(HexCodes.Green)
					.setTitle('Access Revoked')
					.setDescription(`Access to private channel "${iden}" was revoked from ${userMention(member.id)}`);
				interaction.reply({
					embeds: [e.export()],
				});
			} else {
				const e = SterlingEmbed.casual()
					.setColor(HexCodes.Yellow)
					.setTitle('Access Identifier Error')
					.setDescription(`Identifier "${iden}" does not exist!`);
				interaction.reply({
					embeds: [e.export()],
				});
			}
		} else if (subcmd === 'start') {
			unsupportedCommand(interaction);
		} else if (subcmd === 'stop') {
			unsupportedCommand(interaction);
		}
	},
};