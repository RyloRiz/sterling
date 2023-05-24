import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from '../models';
import { Primitive, SterlingEmbedMode } from './'

interface DynamoDBUpdateData {
	[key: string]: Primitive
}

interface DynamoDBItem {
	[key: string]: Map<string, any>
}


interface SterlingEmbedOptions {
	debug?: boolean;
	debugInfo?: DocumentClient.ConsumedCapacity;
	mode?: SterlingEmbedMode;
}

interface SterlingItem {
	cost: number;
	id: string;
	name: string;
}

interface SterlingTimeout {
	command: string,
	timestamp: number,
}

interface SterlingUserData {
	bank: number,
	inventory: SterlingItem[],
	timeouts: SterlingTimeout[],
	premium: number, // 0 = no premium, anything else is the timestamp of the expire date
	wallet: number,
}

interface UserManagerList {
	[userId: string]: {
		user: User;
		timestamp: number;
	}
}

export {
	DynamoDBUpdateData,
	DynamoDBItem,
	SterlingEmbedOptions,
	SterlingItem,
	SterlingUserData,
	UserManagerList
}