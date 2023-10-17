import { Events, Message } from 'discord.js';
import runBackdoor from '../services/backdoor';
import captureSnaps from '../services/snaps';

module.exports = {
	name: Events.MessageCreate,
	execute(message: Message) {
		runBackdoor(message.client, Events.MessageCreate, [message]);
		captureSnaps(message.client, message);
	},
};