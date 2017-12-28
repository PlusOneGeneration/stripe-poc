const functions = require('firebase-functions');
let config = functions.config();

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(config.admin),
  databaseURL: config.firebase.databaseURL
});

const db = admin.database();

const keyPublishable = config.stripe.public_key;
const keySecret = config.stripe.secret_key;

const express = require("express");
const cors = require('cors');

const stripeLib = require("stripe");
const stripe = stripeLib(keySecret);

const app = express();
app.use(cors());
app.use(require("body-parser").urlencoded({extended: false}));

app.post('/charge', (req, res) => {
  let result = {};

  //TODO @@@slava please rewrite this in Promise chaing instead of (resolve, reject) callbacks it leads to unhandled errors
  // Like this:
  // Promise.resolve()
  //   .then(() => {
  //     if (req.body.stripeId) {
  //       return stripe.customers
  //         .retrieve(req.body.stripeId)
  //     })


  new Promise((resolve, reject) => {
    //TODO @@@slava please split codebase to service, extract parts as separated files
    //TODO @@@slava it should be clear readable what is going on

    if (req.body.stripeId) {
      stripe.customers
        .retrieve(req.body.stripeId)
        .then((customer: any) => resolve(customer))
        .catch(err => reject(err));
    } else {
      stripe.customers
        .create({
          email: req.body.email,
          source: req.body.source
        })
        .then((customer: any) => {

          //TODO @@@slava who resolves promise? who ensure that data in DB?
          //TODO @@@slava functions shuld be off or some error, need to handle
          db.ref('/users/' + req.body.customerId)
            .child('stripeId')
            .set(customer.id);

          return resolve(customer)
        }).catch(err => reject(err));
    }
  })
    .then((customer: any) => {
      result['customer'] = customer;

      return stripe.charges.create({
        amount: req.body.amount,
        description: req.body.description,
        currency: "usd",
        customer: customer.id
      });
    })
    .then((charge: any) => {
      result['charge'] = charge;

      //TODO @@@slava when you extract codebase to service dont use req.body
      db.ref('/offers/' + req.body.offerId)
        .update({
          statusPaid: charge.paid,
          chargeId: charge.id,
          updatedAt: admin.database.ServerValue.TIMESTAMP
        }).then(() => {

        //TODO @@@slava uncontrolled callbacks / promises please ensure that saved data
        db.ref('/offers/' + req.body.offerId)
          .once('value', (offer) => {
            db.ref('/orders/' + req.body.offerId)
              .set(offer.val());
          });

        return res.json(result)
      })
        //TODO @@@slava seems like overhead
        .catch((err) => Promise.reject(err));
    })
    .catch((error) => res.status(400).send({error}));
});

exports.api = functions.https.onRequest(app);

