const db = require('./db.service').db;

class OrderService {
	constructor() {}

  createOrder(offerId, customerId, offer) {
    return new Promise((resolve, reject) => {
      db.ref(`/orders/${customerId}/${offerId}`).set(offer, (error) => error ? reject(error) : resolve());
    });
  }
}

module.exports = new OrderService();
