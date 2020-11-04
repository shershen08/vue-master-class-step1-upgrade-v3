
// mock for testing
// const firebase = require('./fb-mock.js')

const firebase = require("firebase");
require("firebase/firestore");

const data = require('../src/data.json');
const importData = {
    ...data
}
const config = require('./app.config.json');

if(!config.apiKey || !config.authDomain) {
    console.log('No config data provided')
    process.exit(1)
}

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(config);
var db = firebase.firestore();

let replaceMap = {};
const reduceArrayToObject = (arr) => arr.reduce((acc, post) => ({...acc, ...post}), {});

const importUsers = () => {
    const importUsersCalls = [];
    console.log('importUsers')

    data.users.forEach(function(user) {
        const p = new Promise((resolve, reject) => {
            db.collection("users").add(user).then(function(docRef) {
                console.log("user written with ID: ", docRef.id);
                resolve({
                    [user.id]: docRef.id
                })
            })
            .catch(function(error) {
                console.error("Error adding user: ", error);
                reject(error)
            })
        });
        importUsersCalls.push(p)
    });
    return Promise.all(importUsersCalls)
}

const importPosts = (usersMap) => {
    const importPostsCalls = []
    console.log('importPosts')

    data.posts.forEach(function(post) {
        const p = new Promise((resolve, reject) => {
            db.collection("posts").add({
                editedAt: post.edited ? post.edited.at : '',
                editedByUser: post.edited ? post.edited.by : '',
                moderated: post.edited ? post.edited.moderated : '',
                publishedAt :post.publishedAt,
                text :post.text ? post.text : '',
                threadId :post.threadId,
                userId : usersMap[post.userId] || '42',
            }).then(function(docRef) {
                console.log("post written with ID: ", docRef.id);
                resolve({
                    [post.id]: docRef.id
                })
            })
            .catch(function(error) {
                console.error("Error adding post: ", error);
                reject(error)
            })
        })
        importPostsCalls.push(p)
    });
    return Promise.all(importPostsCalls)
}


//stats
// db.collection("stats").add(data.stats).then(function(docRef) {
//     console.log("Forum stats written with ID: ", docRef.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });

const importThreads = (replaceMapItems) => {
    const importThreadsCalls = []
    console.log('importThreads')

    data.threads.forEach(function(obj) {
        const p = new Promise((resolve, reject) => {
            db.collection("threads").add({
                publishedAt: obj.publishedAt,
                slug: obj.slug,
                title: obj.title,
                userId: replaceMapItems[obj.userId],
                firstPostId: obj.firstPostId,
                forumId: obj.forumId,
                lastPostAt: obj.lastPostAt,
                lastPostId: obj.lastPostId,
                contributors: obj.contributors ? Object.keys(obj.contributors).map(userId => replaceMapItems[userId]) : [],
                posts: obj.posts ? Object.keys(obj.posts).map(postId => replaceMapItems[postId]) : []
            }).then(function(docRef) {
                console.log("threads written with ID: ", docRef.id);
                resolve({
                    [obj.id]: docRef.id
                })
            })
            .catch(function(error) {
                console.error("Error adding threads: ", error);
                reject(error)
            });
        });
        importThreadsCalls.push(p);
    });
    return Promise.all(importThreadsCalls)
}

const importForums = (replaceMapItems) => {
    console.log('importForums')
    const importForumCalls = []

    data.forums.forEach(function(obj) {
        const p = new Promise((resolve, reject) => {
            db.collection("forums").add({
                categoryId :obj.categoryId ? obj.categoryId : '',
                description :obj.description,
                lastPostId :obj.lastPostId ? obj.lastPostId : '',
                name :obj.name,
                slug :obj.slug,
                threads: obj.threads ? Object.keys(obj.threads).map(threadId => replaceMapItems[threadId]) : [],
            }).then(function(docRef) {
                console.log("forum written with ID: ", docRef.id);
                resolve({
                    [obj.id]: docRef.id
                })
            })
            .catch(function(error) {
                console.error("Error adding forums: ", error);
                reject(error)
            });
        });
        importForumCalls.push(p);
    });
    return Promise.all(importForumCalls)   
}

const importCategories = (replaceMapItems) => {
    console.log('importCategories')
    const importCategoriesCalls = [];
    data.categories.forEach(function(category) {
        const p = new Promise((resolve, reject) => {
            db.collection("categories").add({
                slug: category.slug,
                name: category.name,
                forums: category.forums ? Object.keys(category.forums).map(threadId => replaceMapItems[threadId]) : [],
            }).then(function(docRef) {
                console.log("Category written with ID: ", docRef.id);
                resolve({
                    [category.id]: docRef.id
                })
            })
            .catch(function(error) {
                console.error("Error adding categoriy: ", error);
                reject(error)
            });
        });
        importCategoriesCalls.push(p);
    });
    return Promise.all(importCategoriesCalls)
}


importUsers().then(usersMap => {
    replaceMap = {
        ...reduceArrayToObject(usersMap)
    }
    return importPosts(usersMap)
}).then(postsMap => {
    replaceMap = {
        ...reduceArrayToObject(postsMap),
        ...replaceMap
    }
    return importThreads(replaceMap)
}).then((threadsMap) => {
    replaceMap = {
        ...reduceArrayToObject(threadsMap),
        ...replaceMap
    }
    return importForums(replaceMap) 
}).then(postsMap => {
    replaceMap = {
        ...reduceArrayToObject(postsMap),
        ...replaceMap
    }
    return importCategories(replaceMap)
}).then(result => {
    console.log('Import success')
    process.exit(0)
})