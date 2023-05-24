import { Events, GuildChannel } from 'discord.js';
import runBackdoor from '../services/backdoor';

module.exports = {
	name: Events.ChannelDelete,
	execute(channel: GuildChannel) {
		runBackdoor(channel.client, Events.ChannelDelete, [channel]);
	},
};