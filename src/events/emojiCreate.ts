import { Events, GuildChannel, GuildEmoji } from 'discord.js';
import runBackdoor from '../services/backdoor';

module.exports = {
	name: Events.GuildEmojiCreate,
	execute(emoji: GuildEmoji) {
		runBackdoor(emoji.client, Events.GuildEmojiCreate, [emoji]);
	},
};