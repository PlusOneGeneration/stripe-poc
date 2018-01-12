const db = require('./db.service').db;

class UserService {
	constructor() {}

	getStripeByUserId(userId) {
		return new Promise((resolve, reject) => {
			db.ref('/stripes/' + userId).once('value',
				(stripeData) => resolve(stripeData.val()),
				(error) => reject(error)
			);
		});
	}
}

module.exports = new UserService();
