const db = require('./db.service').db;
const getTimestamp = require('./db.service').timestamp;

class OfferService {
	constructor() {}

  getOfferById(offerId) {
    return new Promise((resolve, reject) => {
      db.ref('/offers/' + offerId)
        .once('value',
          (offer) => resolve(offer.val()),
          (error) => reject(error)
        )
    });
  }

  updateOffer(offerId, charge) {
    return new Promise((resolve, reject) => {
      db.ref('/offers/' + offerId)
        .update({
          statusPaid: charge.paid,
          chargeId: charge.id,
          updatedAt: getTimestamp()
        }, (error) => {
          if (error) {
            return reject(error);
          } else {
            return this.getOfferById(offerId)
              .then((offer) => resolve(offer))
              .catch((err) => reject(err));
          }
        });
    });
  }
}

module.exports = new OfferService();
