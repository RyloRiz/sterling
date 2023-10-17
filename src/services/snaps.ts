import { EmbedBuilder, type Client, type Message } from "discord.js";
import { globals } from "../util";

async function captureSnaps(client: Client, message: Message) {
	let data = await client.services.jsonbin.readBin(globals.SNAPS_BIN_ID);
	let snaps = data.snaps as string[];
	for (let i = 0; i < snaps.length; i++) {
		let snap = snaps[i];
		let split = snap.split('_');
		// let guildId = split[0];
		let sourceId = split[1];
		let targetId = split[2];
		if (message.channelId === sourceId) {
			let target = await client.channels.fetch(targetId);
			if (target?.isTextBased()) {
				const embed = new EmbedBuilder();
				embed.setAuthor({
					iconURL: message.author.avatar || '',
					name: message.author.username,
				});
				embed.setDescription(message.content);
				embed.setTimestamp();
				embed.setURL(message.url);

				target.send({
					embeds: [embed],
				});
			}
		}
	}
}

export default captureSnaps;