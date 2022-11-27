import { APIEmbedField, EmbedBuilder, RestOrArray } from "discord.js"
import { HexCodes, SterlingEmbedMode, SterlingEmbedOptions } from '../util'

const imgUrl = 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80';

class SterlingEmbed {
	public embed: EmbedBuilder;
	// public options: SterlingEmbedOptions = {
	// 	isFormal: false
	// };
	constructor(options?: SterlingEmbedOptions) {
		// if (options) this.options = options;

		const text = 'Powered by Sterling' + (options?.debug ?? ` • Consumed ${options?.debugInfo?.ReadCapacityUnits}RCU/${options?.debugInfo?.WriteCapacityUnits}WCU`);

		this.embed = new EmbedBuilder()
			.setTimestamp()
			.setFooter({ text: text, iconURL: imgUrl });

		if (options?.mode === SterlingEmbedMode.Currency) {
			this.embed
				.setColor(HexCodes.Green);
		} else if (options?.mode === SterlingEmbedMode.Developer) {
			this.embed
				.setColor(HexCodes.Orange);
		} else if (options?.mode === SterlingEmbedMode.Formal) {
			this.embed
				.setAuthor({ name: 'Sterling', iconURL: imgUrl, url: 'https://discord.gg/hWpnws9svu' })
				.setColor(HexCodes.Green);
		}
	}

	public addBlankField(inline: boolean) {
		this.embed.addFields(
			{ name: '\u200B', value: '\u200B', inline: inline }
		);
		return this;
	}

	public addFields(...fields: RestOrArray<APIEmbedField>) {
		this.embed.addFields(...fields);
		return this;
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