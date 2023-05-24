import { incrementDateByOneMonth, PremiumTypes, SterlingUserData } from '../util';
import { DynamoDB } from '../services'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const db = new DynamoDB('SterlingBot');

class User {
	public active: boolean = true;
	private changed: Array<keyof SterlingUserData> = [];
	public consumedCapacity?: DocumentClient.ConsumedCapacity;
	public data: SterlingUserData;
	public userId: string;
	public isNewUser: boolean;
	/**
	 * @private
	 */
	private constructor(userId: string, data: SterlingUserData, isNewUser: boolean, consumedCapacity?: DocumentClient.ConsumedCapacity) {
		this.userId = userId;
		this.data = data;
		this.isNewUser = isNewUser;
		this.consumedCapacity = consumedCapacity;

		let interval: NodeJS.Timer;
		interval = setInterval(async () => {
			if (this.active === false) { clearInterval(interval); }
			if (this.changed.length === 0) { return; }
			if (this.isNewUser) { return; }

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
		let isNewUser: boolean;
		if (raw?.data) {
			consumedCapacity = raw.data.ConsumedCapacity as DocumentClient.ConsumedCapacity;
			const retrieved = [raw.data.Item?.bank, raw.data.Item?.wallet, raw.data.Item?.premium];
			data = {
				bank: retrieved[0] || 0,
				inventory: [],
				timeouts: [],
				premium: retrieved[2] || 0,
				wallet: retrieved[1] || 0,
			}
			isNewUser = typeof retrieved[0] === 'number';
		} else {
			data = {
				bank: 0,
				inventory: [],
				timeouts: [],
				premium: 0,
				wallet: 0,
			}
			isNewUser = true;
		}

		return new User(userId, data, isNewUser, consumedCapacity);
	}

	destruct() {
		this.changed = ['bank', 'wallet', 'premium'];
		this.active = false;
	}

	addBank(amount: number) {
		this.isNewUser = false;
		this.data.bank += amount;
		this.changed.push('bank');
	}

	removeBank(amount: number) {
		this.isNewUser = false;
		this.data.bank -= amount;
		this.changed.push('bank');
	}

	addWallet(amount: number) {
		this.isNewUser = false;
		this.data.wallet += amount;
		this.changed.push('wallet');
	}

	removeWallet(amount: number) {
		this.isNewUser = false;
		this.data.wallet -= amount;
		this.changed.push('wallet');
	}

	subscribePremium(boostAmount: PremiumTypes) {
		this.isNewUser = false;
		let newTimestamp: Date;
		if (this.data.premium === 0) {
			newTimestamp = new Date();
		} else {
			newTimestamp = new Date(this.data.premium);
		}
		for (let i = 0; i < boostAmount; i++) {
			newTimestamp = incrementDateByOneMonth(newTimestamp);
		}
		this.data.premium = newTimestamp.getTime();
		this.changed.push('premium');
	}
}

export default User;