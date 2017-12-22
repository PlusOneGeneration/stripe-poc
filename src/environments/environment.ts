// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAk9k7HnnJ8usbo9WAQ3EG7sRm9-Awz1Ek",
    authDomain: "stripe-poc-52493.firebaseapp.com",
    databaseURL: "https://stripe-poc-52493.firebaseio.com",
    projectId: "stripe-poc-52493",
    storageBucket: "stripe-poc-52493.appspot.com",
    messagingSenderId: "805108102863"
  }
};
