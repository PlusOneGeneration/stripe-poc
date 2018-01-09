//TODO @@@slava const/let usage, use const instead

//TODO @@@slava it would be great to have this code {{{
const functions = require('firebase-functions');
let config = functions.config();

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(config.admin),
  databaseURL: config.firebase.databaseURL
});

const db = admin.database();
//TODO @@@slava }}} reusable, please extract this to reuse

//TODO @@@slava FirebaseService pretty common name. There is business logic for offers and orders mostly.
class FirebaseService {
  getStripeByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.ref('/stripes/' + userId).once('value',
        (stripeData) => resolve(stripeData.val()),
        (error) => reject(error)
      );
    });
  }

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
          updatedAt: admin.database.ServerValue.TIMESTAMP
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

  createOrder(offerId, offer) {
    return new Promise((resolve, reject) => {
      db.ref('/orders/' + offerId).set(offer, (error) => error ? reject(error) : resolve());
    });
  }

  updateUserStripeId(userId, stripeCustomerId) {
    return new Promise((resolve, reject) => {
      db.ref('/users/' + userId)
        .update({'stripeCustomerId': stripeCustomerId}, (error) => error ? reject(error) : resolve());
    });
  }
}

module.exports = FirebaseService;
