import { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { DisabledCommandEmbed, SterlingEmbed } from '../models';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('premium')
		.setDescription('Buy Sterling Premium!'),

	async execute(interaction: CommandInteraction) {
		return await interaction.reply({
			embeds: [DisabledCommandEmbed.export()]
		});
		let embed = SterlingEmbed.casual()
			.setTitle('Thank you for buying Sterling Premium')
			.setDescription('This purchase will support the developers hard at work developing Sterling. For now, here\'s the pricing details:')
			.addFields(
				{ name: 'One Month Premium', value: '1 One Month Nitro Gift (1 x $9.99)', inline: true },
				{ name: 'Three Months Premium', value: '3 One Month Nitro Gift (3 x $9.99)', inline: true }
			)
			.addBlankField()
			.addFields(
				{ name: 'Six Months Premium', value: '6 One Month Nitro Gift (6 x $9.99)', inline: true },
				{ name: 'One Year Premium', value: 'One Year Nitro Gift (1 x $99.99)', inline: true }
			);

		const row = new ActionRowBuilder<SelectMenuBuilder>()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('premium')
					.setPlaceholder('No Plan Selected')
					.setMaxValues(1)
					.addOptions(
						{
							label: 'One Month Premium',
							description: 'Get Sterling Premium for one month',
							value: '1_One_Month',
						},
						{
							label: 'Three Month Premium',
							description: 'Get Sterling Premium for three months',
							value: '3_Three_Month',
						},
						{
							label: 'Six Month Premium',
							description: 'Get Sterling Premium for six months',
							value: '6_Six_Month',
						},
						{
							label: 'One Year Premium',
							description: 'Get Sterling Premium for one year',
							value: '12_One_Year',
						},
					),
			);

		await interaction.reply({ embeds: [embed.export()], components: [row] });
	},
};