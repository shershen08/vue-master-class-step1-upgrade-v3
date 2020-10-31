import { createStore } from 'vuex'
import sourceData from '@/data'

import { firestoreAction, vuexfireMutations } from 'vuexfire';
import { db } from '@/main';

const store = createStore({
  state: {
    // ...sourceData,
    users: [],
    posts: [],
    forums: [],
    categories: [],
    threads: [],
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },

  getters: {
    authUser (state) {
      return state.users.find(u => u.key === state.authId) || {}
    },
    userPosts: (state) => {
      return state.posts.filter(p => p.userId === state.authId)
    },
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
    bindThreads: firestoreAction((context) => context.bindFirestoreRef('threads', db.collection('threads')))
  },

  mutations: {
    ...vuexfireMutations,
    setPost (state, {post, postId}) {
      state.posts.push(post)
    },

    setUser (state, {user, userId}) {
      const userIndex = state.users.findIndex(user => user.key === userId)
      state.users.splice(userIndex, 1, user)
    },

    appendPostToThread (state, {postId, threadId}) {
      const threadIndex = state.threads.findIndex(thread => thread.key === threadId)
      state.threads[threadIndex].posts[postId] = postId
    }
  }
})

export default store