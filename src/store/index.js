import { createStore } from 'vuex'
import sourceData from '@/data'

import { firestoreAction, vuexfireMutations, firestoreOptions } from 'vuexfire';
import { db } from '@/main';

firestoreOptions.wait = true

const store = createStore({
  state: {
    // ...sourceData,
    users: [],
    posts: [],
    forums: [],
    categories: [],
    threads: [],
    activeUser: {},
    authId: 'bTqsiklblWGtnqDpumcO' // from key in Fb store
  },

  getters: {
    userPosts: (state) => state.posts.filter(p => p.userId === state.activeUser.key),
    authUser: (state) => state.activeUser,
    posts: (state) => state.posts,
    users: (state) => state.users,
    forums: (state) => state.forums,
    categories: (state) => state.categories,
    threads: (state) => state.threads
  },

  actions: {
    createPost ({commit, state}, post) {
      const postId = 'greatPost' + Math.random()
      post['key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', {post, postId})
      commit('appendPostToThread', {threadId: post.threadId, postId})
    },

    updateUser ({commit}, user) {
      commit('setUser', {userId: user['key'], user})
    },
    bindUsers: firestoreAction((context) => context.bindFirestoreRef('users', db.collection('users'))),
    bindPosts: firestoreAction((context) => context.bindFirestoreRef('posts', db.collection('posts'))),
    bindForums: firestoreAction((context) => context.bindFirestoreRef('forums', db.collection('forums'))),
    bindCategories: firestoreAction((context) => context.bindFirestoreRef('categories', db.collection('categories'))),
    bindThreads: firestoreAction((context) => context.bindFirestoreRef('threads', db.collection('threads'))),

    setAuthUser({commit, state}){
      db.collection('users').doc(state.authId).get().then(snapshot => {
        const user = snapshot.data()
        commit('setActiveUser', {
          user,
        })
      })
    }
  },

  mutations: {
    ...vuexfireMutations,

    setPost (state, {post, postId}) {
      db.collection('posts').add(post)
    },

    setActiveUser (state, {user}){
      state.activeUser = user
    },

    setUser (state, {user, userId}) {
      state.activeUser = user
      db.collection('users').doc(state.authId).update(user)
    },

    appendPostToThread (state, {postId, threadId}) {

      const newThread = {
        ...state.threads.find(thread => thread.key === threadId)
      }
      newThread.posts[postId] = postId

      db.collection('threads')
        .doc(threadId)
        .set(newThread)
        .then(() => {
          // newThread updated
        })
    }
  }
})

export default store