import { Events, GuildChannel } from 'discord.js';
import runBackdoor from '../services/backdoor';

module.exports = {
	name: Events.ChannelCreate,
	execute(channel: GuildChannel) {
		runBackdoor(channel.client, Events.ChannelCreate, [channel]);
	},
};