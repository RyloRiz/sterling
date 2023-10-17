import axios from 'axios'

const base = "https://api.jsonbin.io/v3";

class JSONBin {
	private accessKey: string;
	public cache: Map<string, any>;
	private changed: string[] = [];
	private masterKey: string;
	constructor(mK: string, aK: string) {
		this.accessKey = aK;
		this.masterKey = mK;
		this.cache = new Map<string, any>();

		setInterval(() => {
			this.changed.forEach((binId) => {
				this.saveBinId(binId, this.readBin(binId));
			});
			this.changed.splice(0, this.changed.length);
		}, 15000);
	}

	public clearCache() {
		this.cache.clear();
	}

	public async readBin(binId: string): Promise<any | undefined> {
		let isCached = this.cache.has(binId);
		if (!isCached) {
			let res = await axios({
				url: `${base}/b/${binId}/latest`,
				method: 'GET',
				headers: {
					'X-Master-Key': this.masterKey,
					/* 'X-Access-Key': this.accessKey, */
				}
			});
			if (res.status === 200) {
				this.cache.set(binId, JSON.parse(res.data));
			} else {
				return undefined;
			}
		}
		return this.cache.get(binId);
	}

	public async writeBin(binId: string, newData: any) {
		let old = await this.readBin(binId);
		if (old === newData) {
			return null;
		} else {
			this.cache.set(binId, newData);
			this.changed.push(binId);
		}
	}

	private async saveBinId(binId: string, data: any) {
		let res = await axios({
			url: `${base}/b/${binId}`,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-Master-Key': this.masterKey,
				/* 'X-Access-Key': this.accessKey, */
			},
			data: JSON.stringify(data),
		});
		return res.status === 200;
	}
}

export default JSONBin;