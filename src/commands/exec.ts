import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction, GuildMember, PermissionsBitField, parseResponse, ChannelType, CategoryChannel, Collection, GuildChannel, TextChannel, Attachment, italic, User } from 'discord.js';
import { globals, HexCodes } from '../util';
import { SterlingEmbed } from '../models';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exec')
		.setDescription('Manage the entire server using Sterling\'s simple command interface (server admins only)')
		.addSubcommandGroup(group =>
			group
				.setName('channel')
				.setDescription('Channel interface')
				.addSubcommand(sub =>
					sub
						.setName('create')
						.setDescription('Create a new channel')
						.addStringOption(option =>
							option
								.setName('name')
								.setDescription('The name of the new channel')
								.setRequired(true))
						.addBooleanOption(option =>
							option
								.setName('nsfw')
								.setDescription('Whether the new channel is NSFW or not'))
						.addChannelOption(option =>
							option
								.setName('parent')
								.setDescription('The parent category channel')
								.addChannelTypes(ChannelType.GuildCategory))
						.addStringOption(option =>
							option
								.setName('topic')
								.setDescription('The topic of the new channel')))
				.addSubcommand(sub =>
					sub
						.setName('list')
						.setDescription('List all channels'))
				.addSubcommand(sub =>
					sub
						.setName('delete')
						.setDescription('Delete a channel')
						.addChannelOption(option =>
							option
								.setName('channel')
								.setDescription('The channel to modify')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('set-name')
						.setDescription('Change the name of a channel')
						.addChannelOption(option =>
							option
								.setName('channel')
								.setDescription('The channel to modify')
								.setRequired(true))
						.addStringOption(option =>
							option
								.setName('name')
								.setDescription('The name of the channel')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('set-nsfw')
						.setDescription('Change the NSFW status of a channel')
						.addChannelOption(option =>
							option
								.setName('channel')
								.setDescription('The channel to modify')
								.setRequired(true))
						.addBooleanOption(option =>
							option
								.setName('nsfw')
								.setDescription('The new NSFW status of the channel')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('set-parent')
						.setDescription('Change the parent category of a channel')
						.addChannelOption(option =>
							option
								.setName('channel')
								.setDescription('The channel to modify')
								.setRequired(true))
						.addChannelOption(option =>
							option
								.setName('parent')
								.setDescription('The parent category channel')
								.addChannelTypes(ChannelType.GuildCategory)
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('set-slowmode')
						.setDescription('Change the slowmode limit of a channel')
						.addChannelOption(option =>
							option
								.setName('channel')
								.setDescription('The channel to modify')
								.setRequired(true))
						.addIntegerOption(option =>
							option
								.setName('limit')
								.setDescription('The slowmode limit')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('set-topic')
						.setDescription('Change the topic of a channel')
						.addChannelOption(option =>
							option
								.setName('channel')
								.setDescription('The channel to modify')
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(true))
						.addStringOption(option =>
							option
								.setName('topic')
								.setDescription('The topic of the channel')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('nuke')
						.setDescription('Nuke the messages in a channel')
						.addChannelOption(option =>
							option
								.setName('channel')
								.setDescription('The channel to modify')
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(true))
						.addIntegerOption(option =>
							option
								.setName('amount')
								.setDescription('The numbers of messages to nuke starting from the latest sent')
								.setMinValue(1)
								.setMaxValue(99)
								.setRequired(true)))
		)
		.addSubcommandGroup(group =>
			group
				.setName('emoji')
				.setDescription('Emoji interface')
				.addSubcommand(sub =>
					sub
						.setName('create')
						.setDescription('Create a new emoji in the guild')
						.addStringOption(option =>
							option
								.setName('name')
								.setDescription('The name of the new emoji')
								.setRequired(true))
						.addAttachmentOption(option =>
							option
								.setName('attachment')
								.setDescription('The image for the emoji')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('delete')
						.setDescription('Create a new emoji in the guild')
						.addStringOption(option =>
							option
								.setName('name')
								.setDescription('The name of the emoji to delete')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('list')
						.setDescription('List the emojis in the guild'))
		)
		.addSubcommandGroup(group =>
			group
				.setName('guild')
				.setDescription('Guild interface')
				.addSubcommand(sub =>
					sub
						.setName('create')
						.setDescription('Create a new guild')
						.addStringOption(option =>
							option
								.setName('name')
								.setDescription('The name of the new guild')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('delete')
						.setDescription('Delete this guild'))
				.addSubcommand(sub =>
					sub
						.setName('set-icon')
						.setDescription('Set the icon of thisguild')
						.addAttachmentOption(option =>
							option
								.setName('icon')
								.setDescription('The new icon of the guild')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('set-name')
						.setDescription('Change the name of the guild')
						.addStringOption(option =>
							option
								.setName('name')
								.setDescription('The new name of the guild')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('set-owner')
						.setDescription('Change the owner of the guild')
						.addUserOption(option =>
							option
								.setName('user')
								.setDescription('The new owner of the guild')
								.setRequired(true)))
		)
		.addSubcommandGroup(group =>
			group
				.setName('member')
				.setDescription('Member interface')
				.addSubcommand(sub =>
					sub
						.setName('add-role')
						.setDescription('Add a role to a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true))
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to add')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('remove-role')
						.setDescription('Remove a role from a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true))
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to remove')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('ban')
						.setDescription('Ban a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('deafen')
						.setDescription('Deafen a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('kick')
						.setDescription('Kick a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('mute')
						.setDescription('Mute a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('nickname')
						.setDescription('Set the nickname of a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true))
						.addStringOption(option =>
							option
								.setName('nickname')
								.setDescription('The new nickname of the member')
								.setRequired(true)))
				.addSubcommand(sub =>
					sub
						.setName('timeout')
						.setDescription('Timeout a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('The member to modify')
								.setRequired(true))
						.addIntegerOption(option =>
							option
								.setName('duration')
								.setDescription('The length in seconds to timeout the member')
								.setRequired(true)))
		)
		.addSubcommandGroup(group =>
			group
				.setName('role')
				.setDescription('Role interface')
				.addSubcommand(sub =>
					sub
						.setName('create')
						.setDescription('Create a role in the guild')
						.addStringOption(option =>
							option
								.setName('name')
								.setDescription('The name of the new role')
								.setRequired(true))
						.addStringOption(option =>
							option
								.setName('color')
								.setDescription('The color of the new role'))
						.addBooleanOption(option =>
							option
								.setName('hoist')
								.setDescription('Whether the new role should hoist or not'))
						.addBooleanOption(option =>
							option
								.setName('mentionable')
								.setDescription('Whether the new role should be mentionable by everyone or not'))
						.addStringOption(option =>
							option
								.setName('permissions')
								.setDescription('The permissions of the new role'))
						.addIntegerOption(option =>
							option
								.setName('position')
								.setDescription('The position of the new role')))
				.addSubcommand(sub =>
					sub
						.setName('list')
						.setDescription('List the roles in the guild'))
				.addSubcommand(sub =>
					sub
						.setName('delete')
						.setDescription('List the roles in the guild')
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to modify')))
				.addSubcommand(sub =>
					sub
						.setName('set-color')
						.setDescription('Set the color of a role')
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to modify'))
						.addStringOption(option =>
							option
								.setName('color')
								.setDescription('The new color of the role')))
				.addSubcommand(sub =>
					sub
						.setName('set-hoist')
						.setDescription('Set the hoist status of a role')
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to modify'))
						.addBooleanOption(option =>
							option
								.setName('hoist')
								.setDescription('Whether the role should hoist or not')))
				.addSubcommand(sub =>
					sub
						.setName('set-mentionable')
						.setDescription('Set the mentionable status of a role')
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to modify'))
						.addBooleanOption(option =>
							option
								.setName('mentionable')
								.setDescription('Whether the role can be mentioned by everyone or not')))
				.addSubcommand(sub =>
					sub
						.setName('set-permissions')
						.setDescription('Set the permissions of a role')
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to modify'))
						.addStringOption(option =>
							option
								.setName('permisions')
								.setDescription('The new permisions of the role')))
				.addSubcommand(sub =>
					sub
						.setName('set-position')
						.setDescription('Set the position of a role')
						.addRoleOption(option =>
							option
								.setName('role')
								.setDescription('The role to modify'))
						.addIntegerOption(option =>
							option
								.setName('position')
								.setDescription('The new position of the role')))
		)
		.setDMPermission(false),

	async execute(interaction: ChatInputCommandInteraction) {
		const initiator = interaction.member as GuildMember;

		if (initiator.permissions.has(PermissionsBitField.Flags.Administrator) || initiator.id === globals.OWNER_ID) {
			const subcmdGroup = interaction.options.getSubcommandGroup();
			const subcmd = interaction.options.getSubcommand();

			const guild = interaction.guild;
			const channels = guild?.channels;
			const emojis = guild?.emojis;
			const members = guild?.members;
			const roles = guild?.roles;

			const embed = SterlingEmbed.casual()
				.setColor(HexCodes.Green);
			let content: string;

			switch (subcmdGroup) {
				case 'channel':

					if (subcmd === 'create') {
						const name = interaction.options.getString('name') as string;
						const nsfw = interaction.options.getBoolean('nsfw') || false;
						const parent = interaction.options.getChannel('parent') as CategoryChannel | null;
						const topic = interaction.options.getString('topic') || '';
						let c = await channels?.create({
							name: name,
							nsfw: nsfw,
							topic: topic,
						});
						if (parent) {
							c?.setParent(parent);
						}
						embed
							.setTitle(`Channel created`)
							.setDescription(`Channel <#${c?.id}> was created by <@${initiator.id}>`);
					} else if (subcmd === 'list') {
						let all = await channels?.fetch();
						let categories = all?.filter(channel => channel?.type === ChannelType.GuildCategory) as Collection<string, CategoryChannel>;

						embed
							.setTitle(`Channels in ${guild?.name}`);

						let fields = 0;
						categories?.forEach(category => {
							let fieldValue = '';
							category.children.cache.forEach(cc => fieldValue += `- <#${cc.id}>\n`);
							embed.addFields(
								{ name: category.name, value: fieldValue, inline: true }
							);
							fields++;
							if (fields === 3) {
								fields = 0;
								embed.addBlankField();
							}
						});
					} else if (subcmd === 'delete') {
						const channel = interaction.options.getChannel('channel') as GuildChannel;
						embed
							.setTitle('Channel deleted')
							.setDescription(`Channel #${channel.name} was deleted by <@${initiator.id}>`);
						await channel.delete();
					} else if (subcmd === 'nuke') {
						const channel = interaction.options.getChannel('channel') as TextChannel;
						const amount = interaction.options.getInteger('amount') as number;
						await channel.bulkDelete(amount);
						embed
							.setTitle('Channel nuked')
							.setDescription(`Channel <#${channel.id}> was nuked`)
							.addFields(
								{ name: 'Messages Deleted', value: amount.toString() }
							);
					} else if (subcmd === 'set-name') {
						const channel = interaction.options.getChannel('channel') as GuildChannel;
						const name = interaction.options.getString('name') as string;
						embed
							.setTitle('Channel name changed')
							.setDescription(`Channel <#${channel.id}> underwent a name change`)
							.addFields(
								{ name: 'Old Name', value: channel.name, inline: true },
								{ name: 'New Name', value: name, inline: true },
							);
						channel.setName(name);
					} else if (subcmd === 'set-nsfw') {
						const channel = interaction.options.getChannel('channel') as TextChannel;
						const nsfw = interaction.options.getBoolean('nsfw') as boolean;
						embed
							.setTitle('Channel NSFW status changed')
							.setDescription(`Channel <#${channel.id}> underwent a NSFW status change`)
							.addFields(
								{ name: 'Old Status', value: channel.nsfw.toString(), inline: true },
								{ name: 'New Status', value: nsfw.toString(), inline: true },
							);
						channel.setNSFW(nsfw);
					} else if (subcmd === 'set-parent') {
						const channel = interaction.options.getChannel('channel') as GuildChannel;
						const parent = interaction.options.getChannel('parent') as CategoryChannel;
						channel.setParent(parent);
						embed
							.setTitle('Channel parent changed')
							.setDescription(`Channel <#${channel.id}> was parented to "${parent.name}"`);
					} else if (subcmd === 'set-slowmode') {
						const channel = interaction.options.getChannel('channel') as TextChannel;
						const limit = interaction.options.getInteger('limit') as number;
						await channel.setRateLimitPerUser(limit);
						embed
							.setTitle('Channel slowmode changed')
							.setDescription(`Channel <#${channel.id}> underwent a slowmode change`);
					} else if (subcmd === 'set-topic') {
						const channel = interaction.options.getChannel('channel') as TextChannel;
						const topic = interaction.options.getString('topic') as string;
						embed
							.setTitle('Channel topic changed')
							.setDescription(`Channel <#${channel.id}> underwent a topic change`)
							.addFields(
								{ name: 'Old Topic', value: channel.topic || italic('None'), inline: true },
								{ name: 'New Topic', value: topic, inline: true },
							);
						await channel.setTopic(topic);
					}

					break;
				case 'emoji':

					if (subcmd === 'create') {
						embed
							.setColor(HexCodes.Yellow)
							.setTitle('Sorry!')
							.setDescription(`Sterling can't create emojis currently. Check again in the next update!`);
						// const name = interaction.options.getString('name') as string;
						// const attachment = interaction.options.getAttachment('attachment') as Attachment;
						// console.log(attachment.url);
						// await interaction.deferReply();
						// let e = await emojis?.create({
						// 	attachment: attachment.url,
						// 	name: name
						// });
						// console.log('Emoji created');
						// embed
						// 	.setTitle('Emoji created')
						// 	.setDescription(`Emoji <:${name}:${e?.id}> was created`);
					} else if (subcmd === 'delete') {
						const name = interaction.options.getString('name') as string;
						let all = await emojis?.fetch();
						let toDelete = all?.find(e => e.name === name);
						if (toDelete) {
							await emojis?.delete(toDelete);
							embed
								.setTitle('Emoji deleted')
								.setDescription(`Emoji "${name}" was deleted`);
						} else {
							embed
								.setColor(HexCodes.Orange)
								.setTitle('Error when deleting emoji')
								.setDescription(`There is no emoji named "${name}"`);
						}
					} else if (subcmd === 'list') {
						let all = await emojis?.fetch();
						let str = '';
						all?.forEach(e => str += '- ' + (e.animated ? `a:${e.name}:${e.id}` : `:${e.name}:${e.id}`) + '\n');
						embed
							.setTitle(`Channels in ${guild?.name}`)
							.addFields(
								{ name: 'Emojis', value: str }
							);
					}

					break;
				case 'guild':

					if (subcmd === 'create') {
						const name = interaction.options.getString('name') as string;
						const guildCount = (await interaction.client.guilds.fetch())?.values.length;
						if (guildCount < 10) {
							const guild = await interaction.client.guilds.create({
								name: name,
								channels: [
									{
										name: "invite-channel",
										type: ChannelType.GuildText
									},
								]
							});
							const inviteChannel = guild.channels.cache.find(channel => channel.name == "invite-channel") as TextChannel;
							const invite = await inviteChannel.createInvite({ maxAge: 0, unique: true });
							content = invite.url;
							embed
								.setTitle('Guild created')
								.setDescription(`Guild ${name} was created`);
						} else {
							embed
								.setColor(HexCodes.Orange)
								.setTitle('Error when creating guild')
								.setDescription('Sterling is in too many guilds to make one itself');
						}
					} else if (subcmd === 'delete') {
						embed
							.setColor(HexCodes.Orange)
							.setTitle('Error when deleting guild')
							.setDescription('Sterling cannot delete any guilds, only the owner of a guild can');
					} else if (subcmd === 'set-icon') {
						const icon = interaction.options.getAttachment('icon') as Attachment;
						await guild?.setIcon(icon.url);
						embed
							.setTitle('Guild icon changed')
							.setDescription(`The guild underwent an icon change ${italic('(see attached)')}`)
							.setIcon(icon.url);
					} else if (subcmd === 'set-name') {
						const name = interaction.options.getString('name') as string;
						embed
							.setTitle('Guild name changed')
							.setDescription(`The guild underwent an name change`)
							.addFields(
								{ name: 'Old Name', value: guild?.name || italic('No Name'), inline: true },
								{ name: 'New Name', value: name, inline: true }
							);
						await guild?.setName(name);
					} else if (subcmd === 'set-owner') {
						const user = interaction.options.getUser('user') as User;
						const gm = await guild?.members.fetch(user);
						embed
							.setTitle('Guild owner changed')
							.setDescription(`The guild is under new ownership`)
							.addFields(
								{ name: 'Old Name', value: `<@${guild?.ownerId}>`, inline: true },
								{ name: 'New Name', value: `<@${gm?.id}>`, inline: true }
							);
						guild?.setOwner(gm as GuildMember);
					}

					break;
				case 'member':

					if (subcmd === 'add-role') {
					} else if (subcmd === 'remove-role') {
					} else if (subcmd === 'ban') {
					} else if (subcmd === 'deafen') {
					} else if (subcmd === 'kick') {
					} else if (subcmd === 'mute') {
					} else if (subcmd === 'nickname') {
					} else if (subcmd === 'timeout') {
					}

					break;
				case 'role':

					if (subcmd === 'create') {
					} else if (subcmd === 'list') {
					} else if (subcmd === 'delete') {
					} else if (subcmd === 'set-color') {
					} else if (subcmd === 'set-hoist') {
					} else if (subcmd === 'set-mentionable') {
					} else if (subcmd === 'set-permissions') {
					} else if (subcmd === 'set-position') {
					}

					break;
				default:
					const errorE = SterlingEmbed.casual()
						.setColor(HexCodes.Orange)
						.setDescription(`Subcommand not specified`);
					await interaction.reply({
						embeds: [errorE.export()]
					});
					break;
			}

			await interaction.reply({
				embeds: [embed.export()]
			});
		} else {
			const errorE = SterlingEmbed.casual()
				.setColor(HexCodes.Orange)
				.setDescription(`You do not have permission to run this command! Only admins can create journals.`);
			await interaction.reply({
				embeds: [errorE.export()]
			});
		}
	},
};

/*

BOT CREATING A GUILD

const Guild = await client.guilds.create("Test Guild", {
	channels: [
		{"name": "invite-channel"},
	]
});

const GuildChannel = Guild.channels.cache.find(channel => channel.name == "invite-channel");
const Invite = await GuildChannel.createInvite({maxAge: 0, unique: true, reason: "Testing."});
message.channel.send(`Created guild. Here's the invite code: ${Invite.url}`);

*/