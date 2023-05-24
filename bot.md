# Sterling

## Ideas
* When under maintenance, run a script under pm2 on host PC that sends a basic "Unavailable" embed on every AWS/Internet-connected command
* Make better documentation this current one sucks so bad

## Commands

<details>
<summary>Moderation</summary>



</details>
<details>
<summary>Currency</summary>

### /balance `user?: User = self`

### /deposit `amount?: NumberResolvable = MATH.MAX`

### /withdraw `amount?: NumberResolvable = MATH.MAX`

<!-- ### /withdraw
* `amount` **[OPTIONAL]**
* * **TYPE** - `NumberResolvable`
* * **DEFAULT** - `Math.max` -->

### /search
* [autogen]
* [autogen]
* [autogen]

</details>
<details>
<summary>Miscellaneous</summary>

### /ping `ephemeral: boolean`
* ephemeral - Self-explanatory

</details>

___

# `/exec` Commands
**APPEND WHERE APPLICABLE:** `<reason: string>`
* ## `/exec channel`
	* ### `/exec channel create <name: string> [nsfw: boolean = false] [parent: string] [topic: string]`
	* ### `/exec channel list`
	**PREPEND PARAMETER TO THE FOLLOWING:** `<channel: GuildChannel>`
	* ### `/exec channel delete`
	* ### `/exec channel set-name <name: string>`
	* ### `/exec channel set-nsfw <isNSFW: boolean>`
	* ### `/exec channel set-parent <parentId: string>`
	* ### `/exec channel set-slowmode <limit: number>`
	* ### `/exec channel set-topic <topic: string>`
	* ### `/exec channel nuke [amount: number = Math.MAX]`
* ## `/exec emoji`
	* ### `/exec emoji create <name: string> <attachment: AttachmentResolvable>`
	* ### `/exec emoji delete <name: string>`
	* ### `/exec emoji list`
* ## `/exec guild`
	* ### `/exec guild create <name: string>`
	* ### `/exec guild delete`
	* ### `/exec guild set-icon <icon: AttachmentResolvable>`
	* ### `/exec guild set-name <name: string>`
	* ### `/exec guild set-owner <user: GuildMember>`
* ## `/exec member`
	**PREPEND PARAMETER TO THE FOLLOWING:** `<user: GuildMember>`
	* ### `/exec member add-role <role: Role>`
	* ### `/exec member remove-role <role: Role>`
	* ### `/exec member ban`
	* ### `/exec member deafen`
	* ### `/exec member kick`
	* ### `/exec member mute`
	* ### `/exec member nickname <nickname: string>`
	* ### `/exec member timeout <durationInMilliseconds: number>`
* ## `/exec role`
	* ### `/exec role create <name: string> [color: ColorResolvable = Colors.Default] [hoist: boolean = true] [mentionable: boolean = true] [permissions: PermissionResolvable] [position: number = 1]`
	* ### `/exec role list`
	**PREPEND PARAMETER TO THE FOLLOWING:** `<role: Role>`
	* ### `/exec role delete`
	* ### `/exec role set-color <color: ColorResolvable>`
	* ### `/exec role set-hoist <hoist: boolean>`
	* ### `/exec role set-mentionable <mentionable: boolean>`
	* ### `/exec role set-permissions <permissions: PermissionResolvable>`
	* ### `/exec role set-position <position: number>`