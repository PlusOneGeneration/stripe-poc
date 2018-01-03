const functions = require('firebase-functions');
const express = require("express");
const cors = require('cors');

const Stripe = require('./services/stripe.service');
const FireBase = require('./services/firebase.service');
let fb = new FireBase();

const app = express();
app.use(cors());
app.use(require("body-parser").urlencoded({extended: false}));

app.post('/charge', (req, res) => {
  let shopId = req.body.shopId;
  let tokenId = req.body.source;
  let customerEmail = req.body.email;
  let chargeAmount = req.body.amount;
  let chargeDescription = req.body.description;
  let offerId = req.body.offerId;
  let stripeCustomerId = req.body.stripeCustomerId;

  return fb.getStripeByUserId(shopId)
    .then((stripeData) => {
      let stripe = new Stripe(stripeData.secret_key);
      let result = {};

      return stripe.getStripeUser(stripeCustomerId)
        .then((customer) => customer ? customer : stripe.createUser(customerEmail, tokenId))
        .then((customer) => {
          // TODO: improvements: save shopId - stripeCustomerId pair for Customer user;
          result['customer'] = customer;
          return stripe.createCharge(chargeAmount, chargeDescription, 'usd', customer.id);
        })
        .then((charge) => {
          result['charge'] = charge;
          return fb.updateOffer(offerId, charge);
        })
        .then((offer) => fb.createOrder(offerId, offer))
        .then(() => res.send(result));
    })
    .catch((err) => res.status(400).json({err: err}));
});

exports.api = functions.https.onRequest(app);

