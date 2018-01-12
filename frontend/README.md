# StripePoc

## Overview

It's POC (Proof of Concept) project to show minimal workflow of Stripe payments with combination of Angular 2/4 and Firebase Functions.

It has minimal wrapping of Authentication (login/signup). Public - private zones.

Private zone it's kind of Dashboard place where you (as user) can add **Products**, make **Offers** to **Users** *(shop-like behavior)*. Offers created by you can be found in section **My offers**.

To cover customer's behavior you can **Purchase** **Products** in section **Offered to me**.

**Purchasing** -- it's payment action which touches all elements of application: Angular -> Stripe -> Firebase Function. In the end of Positive action it will add **Order** to **Customer**'s orders list.

## Pre-setup

It means you already have accounts for Firebase and Stripe to start. 
Otherwise you can visit:
- `https://firebase.google.com/` -- to launch Firebase account
- `https://stripe.com` -- to launch account for Stripe

## Installation

1. **Important!** Put your Firebase (app project settings) and Stripe (publick key) credentials to `/src/environments/environment.ts`, use `/src/environments/environment.dist.ts ` as example for this
2. Run `npm i` to install dependencies
3. Run `npm start` to run Client side. You can find working project at `http://localhost:4200` in your browser
4. Use `/src/environments/firebase.rules.json` as rules for FB Database 
5. Don't forget to install Functions side. Follow `/functions/README.md` to setup and deploy functions.

## Testing

1. Visit `Sign In` (Signup) section to create at least pair of users for testing purposes. (ex. User1 and User2)
2. Make pair of Stripe accounts.
3. Edit user profiles: put Stripe keys details for each user.

It will allow to Make offers by **User1** to **User2** (or vice versa) and test purchase action from both sides (shop and customer points of view).

