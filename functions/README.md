# Functions

### Pre-setup

It means you already have accounts for Firebase and Stripe to start. 
Otherwise you can visit:
- `https://firebase.google.com/` -- to launch Firebase account
- `https://stripe.com` -- to launch account for Stripe
- setup `Firebase Tools` in case you don't have them by installing `npm i firebase-tools`
- run `firebase init`, chose `functions` and your test project. don't forget to bypass all overwrites, except installing dependencies
- or you can run separatelly ` npm i ` to install dependencies


### Setup

**1. Setup Firebase credentials for Function:**
- to do this you need to visit Firebase Console (`https://console.firebase.google.com`) --> Project Settings --> Service Account --> Create Private Key --> save your `<private_key>.json`
- rename and move `<private_key>.json` -->`/env/firebase-admin.json`
- as example (without actual credentials) you can check `/env/firebase-admin.dist.json`



**2. Setup Stripe credentials:**
- you can find them by link `https://dashboard.stripe.com/account/apikeys`
- use `Publishable key` as `public_key`
- use `Secret key` as `secret_key`
- as example please use `/env/stripe-credentials.json`



**3. Deploy Firebase function:**
- if all is ok just use following command: `npm run deploy` -- this will add Firebase and Stripe credentials to the Function for further usage
- or you can separately run next commands: 1) `npm run config`, 2) `firebase deploy --only functions`



**4. Done! Functions are Deployed. Hope so... :D**




 
