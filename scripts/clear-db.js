const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const config = require('./app.config.json');

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(config);

if(!config.apiKey || !config.authDomain) {
    console.log('No config data provided')
    process.exit(1)
}

console.log('Clearing')

const entities = ['categories', 'users', 'posts', 'threads', 'forums'];
  
var db = firebase.firestore();

entities.forEach(function(collection) {
    // Get a new write batch
    // var batch = firebase.firestore().batch()

    // db.collection(collection).listDocuments().then(val => {
    //     val.map((val) => {
    //         batch.delete(val)
    //     })

    //     batch.commit()
    // })

    const ref = db.collection(collection)
    ref.onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        ref.doc(doc.id).delete()
      })
    })
});
