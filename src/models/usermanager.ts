import { UserManagerList, ValueOf } from '../util'
import { User } from '.'

class UserManager {
	public users: UserManagerList = {};
	constructor() {
		setInterval(() => {
			for (let [k, v] of Object.entries(this.users)) {
				// v = v as typeof this.users[keyof UserManagerList]
				let k2: number = Number(k);
				let v2: ValueOf<UserManagerList> = v;
				if (v2.timestamp + 120000 < Date.now()) {
					console.log("Killing " + v2.user.userId);
					v2.user.destruct();
					delete this.users[k];
				}
			}
		}, 60000);
	}

	async #addUser(userId: string): Promise<User> {
		let u = await User.fetchUser(userId);
		this.users[userId] = {
			timestamp: Date.now(),
			user: u
		}
		return u;
	}

	async getUser(userId: string): Promise<User> {
		// let u = this.users.find(u => u.userId === userId);
		// let u: User | undefined;
		// for (const [k,v] of Object.entries(this.users)) {
		// 	if (k === userId) {

		// 	}
		// }
		let uKey = Object.keys(this.users).find(id => id === userId);
		if (uKey && this.users[Number(uKey)]) {
			let uTbl = this.users[Number(uKey)];
			uTbl.timestamp = Date.now();
			if (uTbl) return uTbl.user;
		}
		return await this.#addUser(userId);
	}
}

const manager = new UserManager();
export default manager;