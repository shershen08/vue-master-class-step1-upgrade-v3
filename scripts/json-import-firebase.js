const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const data = require('../src/data.json');
const config = require('./app.config.json');

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(config);
  
var db = firebase.firestore();

// categories
Object.keys(data.categories).forEach(function(key) {
    const obj = data.categories[key]
    db.collection("categories").add({
        slug: obj.slug,
        name: obj.name,
        key: obj.key,
        forums: Object.keys(obj.forums)
    }).then(function(docRef) {
        console.log("Category written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding categoriy: ", error);
    });
});

// users
Object.keys(data.users).forEach(function(key) {
    const obj = data.users[key]
    db.collection("users").add(obj).then(function(docRef) {
        console.log("user written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding user: ", error);
    });
});

//stats
db.collection("stats").add(data.stats).then(function(docRef) {
    console.log("Forum stats written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

//threads
Object.keys(data.threads).forEach(function(key) {
    const obj = data.threads[key]
    db.collection("threads").add({
        publishedAt: obj.publishedAt,
        slug: obj.slug,
        title: obj.title,
        userId: obj.userId,
        key: obj.key,
        firstPostId: obj.firstPostId,
        forumId: obj.forumId,
        lastPostAt: obj.lastPostAt,
        lastPostId: obj.lastPostId,
        contributors: obj.contributors ? Object.keys(obj.contributors) : [],
        posts: obj.posts ? Object.keys(obj.posts) : []
    }).then(function(docRef) {
        console.log("threads written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding threads: ", error);
    });
});

//forums
Object.keys(data.forums).forEach(function(key) {
    const obj = data.forums[key]
    console.log(obj)
    db.collection("forums").add({
        categoryId :obj.categoryId ? obj.categoryId : '',
        description :obj.description,
        lastPostId :obj.lastPostId ? obj.lastPostId : '',
        name :obj.name,
        slug :obj.slug,
        threads: obj.threads ? Object.keys(obj.threads) : [],
        forums: obj.forums ? Object.keys(obj.forums) : [],
        key :obj.key
    }).then(function(docRef) {
        console.log("forum written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding forums: ", error);
    });
});

//posts
Object.keys(data.posts).forEach(function(key) {
    const obj = data.posts[key]
    db.collection("posts").add({
        editedAt: obj.edited ? obj.edited.at : '',
        editedByUser: obj.edited ? obj.edited.by : '',
        moderated: obj.edited ? obj.edited.moderated : '',
        publishedAt :obj.publishedAt,
        text :obj.text ? obj.text : '',
        threadId :obj.threadId,
        userId :obj.userId,
        key :obj.key
    }).then(function(docRef) {
        console.log("post written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding post: ", error);
    });
});

// Promise.all([]).then(function(docRef) {
//     console.log("All data import is sucessful");
// })