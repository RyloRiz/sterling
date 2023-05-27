import { Events, GuildChannel, GuildEmoji } from 'discord.js';
import runBackdoor from '../services/backdoor';

module.exports = {
	name: Events.GuildEmojiUpdate,
	execute(emoji: GuildEmoji) {
		runBackdoor(emoji.client, Events.GuildEmojiUpdate, [emoji]);
	},
};