import { PermissionFlagsBits, type Client, type TextChannel, type OverwriteResolvable, userMention } from "discord.js";
import { ACCESS_DATABASE, HexCodes } from "../util";
import { SterlingEmbed } from "../models";

async function monitorAccess(client: Client) {
	let t = setInterval(async () => {
		const date = new Date(Date.now());
		for (const [iden, entry] of Object.entries(ACCESS_DATABASE)) {
			if (Object.hasOwn(entry, 'timeout')) {
				let split = entry.timeout?.split(':') as string[];
				if (Number(split[0]) === date.getUTCHours() && Number(split[1]) === date.getUTCMinutes()) {
					// Remove all except channel owner & bot

					let channel = await client.channels.fetch(entry.channel_id) as TextChannel;
					let overwrites: OverwriteResolvable[] = [];
					let ids: string[] = [];

					channel.members.forEach(m => {
						if (m.id === entry.owner || m.id === client.user?.id) return;
						overwrites.push({
							id: m.id,
							deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
						});
						ids.push(userMention(m.id));
					});

					await channel.edit({
						permissionOverwrites: overwrites
					});

					const embed = SterlingEmbed.casual()
						.setColor(HexCodes.Green)
						.setTitle("Scheduled Access Bulk-Revoked")
						.setDescription(`The following members were revoked access: ${ids.join(', ')}`);
					channel.send({
						embeds: [embed.export()]
					});
				}
			}
		}
	}, 1000 * 60);

	return t;
}

export default monitorAccess;