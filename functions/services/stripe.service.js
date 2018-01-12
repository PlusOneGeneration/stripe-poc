const Stripe = require("stripe");

class StripeService {
	constructor(secret_key) {
		this.stripe = Stripe(secret_key);
	}

	getStripe() {
		return this.stripe;
	}

	getStripeUser(stripeCustomerId) {
		if (!stripeCustomerId) {
			return Promise.resolve(null);
		}

		return new Promise((resolve, reject) => {
			this.getStripe().customers.retrieve(stripeCustomerId)
				.then((customer) => resolve(customer), (err) => reject(err));
		});
	}

	createUser(email, tokenId) {
		return new Promise((resolve, reject) => {
			this.getStripe().customers.create({
				email: email,
				source: tokenId
			}).then((customer) => resolve(customer), (err) => reject(err));
		});
	}

	createCharge(amount, description, currency, customerId) {
		return new Promise((resolve, reject) => {
			this.getStripe().charges.create({
				amount: amount,
				description: description,
				currency: currency || "usd",
				customer: customerId
			}).then((charge) => resolve(charge), (err) => reject(err));
		});
	}
}

module.exports = StripeService;
