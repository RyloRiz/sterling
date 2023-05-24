import { Events, GuildChannel } from 'discord.js';
import runBackdoor from '../services/backdoor';

module.exports = {
	name: Events.ChannelPinsUpdate,
	execute(channel: GuildChannel) {
		runBackdoor(channel.client, Events.ChannelPinsUpdate, [channel]);
	},
};