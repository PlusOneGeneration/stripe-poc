const functions = require('firebase-functions');
let config = functions.config();

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(config.admin),
  databaseURL: config.firebase.databaseURL
});

const db = admin.database();

const express = require("express");
const cors = require('cors');

const stripeLib = require("stripe");

const app = express();
app.use(cors());
app.use(require("body-parser").urlencoded({extended: false}));

app.post('/charge', (req, res) => {
  db.ref('/stripes/' + req.body.shopId)
    .once('value', (stripeData) => {
      const stripe = stripeLib(stripeData.val().secret_key);
      let result = {};

      stripe.customers
        .create({
          email: req.body.email,
          source: req.body.source
        }, (err, customer: any) => {
          result['customer'] = customer;

          return stripe.charges.create({
            amount: req.body.amount,
            description: req.body.description,
            currency: "usd",
            customer: customer.id
          }, (err, charge: any) => {
            result['charge'] = charge;

            db.ref('/offers/' + req.body.offerId)
              .update({
                statusPaid: charge.paid,
                chargeId: charge.id,
                updatedAt: admin.database.ServerValue.TIMESTAMP
              }).then(() => {
              db.ref('/offers/' + req.body.offerId)
                .once('value', (offer) => {
                  db.ref('/orders/' + req.body.offerId)
                    .set(offer.val());
                }, (err) => res.status(400).send({err}));

              return res.json(result)
            }).catch((err) => Promise.reject(err));
          });
        })
    }, (err) => {
      return res.status(400).json({err: err});
    });

  // new Promise((resolve, reject) => {
  //   if (req.body.stripeId) {
  //     stripe.customers
  //       .retrieve(req.body.stripeId)
  //       .then((customer: any) => resolve(customer))
  //       .catch(err => reject(err));
  //   } else {
  //     stripe.customers
  //       .create({
  //         email: req.body.email,
  //         source: req.body.source
  //       })
  //       .then((customer: any) => {
  //         db.ref('/users/' + req.body.customerId)
  //           .child('stripeId')
  //           .set(customer.id);
  //         return resolve(customer)
  //       }).catch(err => reject(err));
  //   }
  // })
});

exports.api = functions.https.onRequest(app);

