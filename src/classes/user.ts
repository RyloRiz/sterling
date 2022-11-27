import { SterlingUserData } from '../util';
import { DynamoDB } from '../services'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const db = new DynamoDB('SterlingBot');

class User {
	public active: boolean = true;
	private changed: Array<keyof SterlingUserData> = [];
	public consumedCapacity?: DocumentClient.ConsumedCapacity;
	public data: SterlingUserData;
	public userId: string;
	/**
	 * @private
	 */
	private constructor(userId: string, data: SterlingUserData, consumedCapacity?: DocumentClient.ConsumedCapacity) {
		this.userId = userId;
		this.data = data;
		this.consumedCapacity = consumedCapacity;

		let interval: NodeJS.Timer;
		interval = setInterval(async () => {
			if (this.active === false) { clearInterval(interval); }
			if (this.changed.length === 0) { return; }

			let toUpdate: any = {}
			this.changed.forEach((v) => {
				// @TODO handler for `inventory`
				if (typeof this.data[v] === 'number') {
					toUpdate[v] = this.data[v];
				}
			});

			this.changed = [];

			let res = await db.update({
				id: userId
			}, toUpdate);

			if (res?.data?.ConsumedCapacity) {
				this.consumedCapacity = res?.data?.ConsumedCapacity;
			}
		}, 5000);
	}

	public static async fetchUser(userId: string) {
		let raw = await db.get({
			id: userId
		});

		let consumedCapacity: DocumentClient.ConsumedCapacity | undefined;
		let data: SterlingUserData;
		if (raw?.data) {
			consumedCapacity = raw.data.ConsumedCapacity as DocumentClient.ConsumedCapacity;
			data = {
				bank: raw.data.Item?.bank || 0,
				inventory: [],
				wallet: raw.data.Item?.wallet || 0,
			}
		} else {
			data = {
				bank: 0,
				inventory: [],
				wallet: 0,
			}
		}

		return new User(userId, data, consumedCapacity);
	}

	destruct() {
		this.changed = ['bank', 'wallet'];
		this.active = false;
	}

	addBank(amount: number) {
		this.data.bank += amount;
		this.changed.push('bank');
	}

	removeBank(amount: number) {
		this.data.bank -= amount;
		this.changed.push('bank');
	}

	addWallet(amount: number) {
		this.data.wallet += amount;
		this.changed.push('wallet');
	}

	removeWallet(amount: number) {
		this.data.wallet -= amount;
		this.changed.push('wallet');
	}
}

export default User;