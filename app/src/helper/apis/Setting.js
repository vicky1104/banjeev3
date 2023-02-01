import md5 from "md5";
class Setting {
	/* global BigInt */

	lcrng(seedValue, length) {
		if (typeof BigInt === "undefined") {
			let BigInt = (global.BigInt = require("big-integer"));
			let A = BigInt("3781927463263421");
			let C = BigInt("2113323684682149");
			let MOD = BigInt(Math.pow(10, length));
			let X = BigInt(seedValue);
			let lcr = (A * X + C) % MOD;
			let rid = lcr + "";
			while (rid.length < length) rid = 0 + rid;
			return rid;
		} else {
			let A = BigInt("3781927463263421");
			let C = BigInt("2113323684682149");
			let MOD = BigInt(Math.pow(10, length));
			let X = BigInt(seedValue);
			let lcr = (A * X + C) % MOD;
			let rid = lcr + "";
			while (rid.length < length) rid = 0 + rid;
			return rid;
		}
	}
	md5Hash(sid, rid) {
		return md5(sid + rid);
	}
	setSecurity = (sid, time) => {
		let seedValue = time;
		let rid = this.lcrng(seedValue, 16);
		let hash = this.md5Hash(sid, rid);
		return hash;
	};
}
export default Setting;
