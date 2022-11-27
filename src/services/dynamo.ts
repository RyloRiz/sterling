import dotenv from 'dotenv'
dotenv.config();

import AWS from 'aws-sdk';
import { DynamoDBUpdateData, DynamoDBItem, Primitive } from '../util'

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_DEFAULT_REGION,
});

const docClient = new AWS.DynamoDB.DocumentClient();

class DynamoDB {
	public tableName: string;
	public killSwitch: boolean = false;
	constructor(name: string) {
		this.tableName = name;
	}

	public async get(key: any) {
		if (this.killSwitch) return;
		let params = {
			TableName: this.tableName,
			Key: key,
			ReturnConsumedCapacity: "TOTAL"
		}
		let res = await docClient.get(params).promise();
		if (res.$response.error) {
			return {
				data: null,
				error: res.$response.error
			}
		} else {
			return {
				data: res.$response.data
			}
		}
	}

	public async put(item: DynamoDBItem) {
		if (this.killSwitch) return;

		let params = {
			TableName: this.tableName,
			Item: item,
			ReturnConsumedCapacity: "TOTAL"
		}

		let res = await docClient.put(params).promise();

		if (res.$response.error) {
			return {
				data: null,
				error: res.$response.error
			}
		} else {
			return {
				data: res.$response.data
			}
		}
	}

	public async update(key: any, updateData: DynamoDBUpdateData) {
		if (this.killSwitch) return;

		let str = "set";
		let attrVals: {
			[key: string]: Primitive
		} = {}
		let counter = 0;
		for (const [k, v] of Object.entries(updateData)) {
			// k = me-set key names
			// v = values
			// "set k = :v2"
			let gen = `:key${counter}`;
			str += ` ${k} = ${gen},`;
			attrVals[gen] = v
			counter++;
		}
		let params = {
			TableName: this.tableName,
			Key: key,
			UpdateExpression: str.substring(0, str.length - 1),
			ExpressionAttributeValues: attrVals,
			ReturnConsumedCapacity: "TOTAL"
		}
		let res = await docClient.update(params).promise();
		if (res.$response.error) {
			return {
				data: null,
				error: res.$response.error
			}
		} else {
			return {
				data: res.$response.data
			}
		}
	}
}

export default DynamoDB;