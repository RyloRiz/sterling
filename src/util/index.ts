import { globals } from "./globals"
import { AccessDBEntry } from "./interfaces"

export { Primitive, ValueOf } from "./types"
export { HexCodes, PremiumTypes, SterlingEmbedMode } from "./enum"
export * from "./interfaces"
export * from "./functions"
export { globals } from './globals'

export const ACCESS_DATABASE: {
	[key: string]: AccessDBEntry
} = {
	'widi': {
		channel_id: '1164349935387430922',
		owner: globals.OWNER_ID,
		timeout: '07:30' //'00:30'
	},
	'btest': {
		channel_id: '1164497774360920075',
		owner: globals.OWNER_ID,
		timeout: '07:30' //'00:30'
	}
}