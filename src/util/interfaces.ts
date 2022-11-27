import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { User } from '../classes';
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

interface SterlingUserData {
	bank: number,
	inventory: SterlingItem[],
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