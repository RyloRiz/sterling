import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { APIEmbedField, EmbedBuilder, RestOrArray } from "discord.js"
import { HexCodes, SterlingEmbedMode, SterlingEmbedOptions } from '../util'

const imgUrl = 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80';

class SterlingEmbed {
	private embed: EmbedBuilder;
	// public options: SterlingEmbedOptions = {
	// 	isFormal: false
	// };
	private constructor(options?: SterlingEmbedOptions) {
		// if (options) this.options = options;

		const text = 'Powered by Sterling' + (options?.debug === true ? ` • Consumed ${options?.debugInfo?.CapacityUnits}CU` : '');

		this.embed = new EmbedBuilder()

		if (options?.mode === SterlingEmbedMode.Barebones) {
			this.embed;
		} else if (options?.mode === SterlingEmbedMode.Casual) {
			this.embed
				.setColor(HexCodes.Green)
				.setFooter({ text: text });
		} else if (options?.mode === SterlingEmbedMode.Currency) {
			this.embed
				.setFooter({ text: text });
		} else if (options?.mode === SterlingEmbedMode.Developer) {
			this.embed
				.setColor(HexCodes.Orange)
				.setTimestamp()
				.setFooter({ text: text, iconURL: imgUrl });
		} else if (options?.mode === SterlingEmbedMode.Formal) {
			this.embed
				.setAuthor({ name: 'Sterling', iconURL: imgUrl, url: 'https://discord.gg/hWpnws9svu' })
				.setColor(HexCodes.Green)
				.setFooter({ text: text, iconURL: imgUrl });
		} else if (options?.mode === SterlingEmbedMode.Moderation) {
		}
	}

	public static barebones(debugInfo?: DocumentClient.ConsumedCapacity) {
		let options: SterlingEmbedOptions = {
			mode: SterlingEmbedMode.Barebones
		}
		if (debugInfo) {
			options.debug = true;
			options.debugInfo = debugInfo;
		}
		return new SterlingEmbed(options);
	}

	public static casual(debugInfo?: DocumentClient.ConsumedCapacity) {
		let options: SterlingEmbedOptions = {
			mode: SterlingEmbedMode.Casual
		}
		if (debugInfo) {
			options.debug = true;
			options.debugInfo = debugInfo;
		}
		return new SterlingEmbed(options);
	}

	public static currency(debugInfo?: DocumentClient.ConsumedCapacity) {
		let options: SterlingEmbedOptions = {
			mode: SterlingEmbedMode.Currency
		}
		if (debugInfo) {
			options.debug = true;
			options.debugInfo = debugInfo;
		}
		return new SterlingEmbed(options);
	}

	public static developer(debugInfo?: DocumentClient.ConsumedCapacity) {
		let options: SterlingEmbedOptions = {
			mode: SterlingEmbedMode.Developer
		}
		if (debugInfo) {
			options.debug = true;
			options.debugInfo = debugInfo;
		}
		return new SterlingEmbed(options);
	}

	public static formal(debugInfo?: DocumentClient.ConsumedCapacity) {
		let options: SterlingEmbedOptions = {
			mode: SterlingEmbedMode.Formal
		}
		if (debugInfo) {
			options.debug = true;
			options.debugInfo = debugInfo;
		}
		return new SterlingEmbed(options);
	}

	public addBlankField(inline: boolean = false) {
		this.embed.addFields(
			{ name: '\u200B', value: '\u200B', inline: inline }
		);
		return this;
	}

	/**
	 * Use addBlankField for newlines
	 */
	public addFields(...fields: RestOrArray<APIEmbedField>) {
		this.embed.addFields(...fields);
		return this;
	}

	public clearFields() {
		this.embed.spliceFields(0, 25);
		return this;
	}

	public setDescription(desc: string) {
		this.embed.setDescription(desc);
		return this;
	}

	public setIcon(url: string) {
		this.embed.setImage(url);
		return this;
	}

	public export() {
		return this.embed;
	}

	public setColor(color: HexCodes) {
		this.embed.setColor(color);
		return this;
	}

	public setTitle(title: string) {
		this.embed.setTitle(title);
		return this;
	}
}

export default SterlingEmbed;

export const DisabledCommandEmbed = SterlingEmbed.barebones();
DisabledCommandEmbed.setTitle('Command Disabled');
DisabledCommandEmbed.setDescription('We\'re sorry, but this command has been disabled for the time being. Please check again later.')