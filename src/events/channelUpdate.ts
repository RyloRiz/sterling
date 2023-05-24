import { Events, GuildChannel } from 'discord.js';
import runBackdoor from '../services/backdoor';

module.exports = {
	name: Events.ChannelUpdate,
	execute(oldChannel: GuildChannel, newChannel: GuildChannel) {
		runBackdoor(newChannel.client, Events.ChannelUpdate, [oldChannel, newChannel]);
	},
};