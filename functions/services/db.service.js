const functions = require('firebase-functions');
const config = functions.config();
const admin = require('firebase-admin');

admin.initializeApp({
	credential: admin.credential.cert(config.admin),
	databaseURL: config.firebase.databaseURL
});

const db = admin.database();

module.exports = {
	db: db,
	timestamp: () => admin.database.ServerValue.TIMESTAMP
};
