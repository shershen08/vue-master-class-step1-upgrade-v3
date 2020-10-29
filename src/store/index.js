import { createStore } from 'vuex'
import sourceData from '@/data'

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },

  getters: {
    authUser (state) {
      return state.users[state.authId]
    },
    userPosts: (state) => (userId) => {
      const nonReactive = JSON.parse(JSON.stringify(state.posts))
      console.log(nonReactive)
      return nonReactive.filter(p => p.userId === userId)
    }
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
    }
  },

  mutations: {
    setPost (state, {post, postId}) {
      state.posts[postId] = post
    },

    setUser (state, {user, userId}) {
      state.users[userId] = user
    },

    appendPostToThread (state, {postId, threadId}) {
      const thread = state.threads[threadId]
      thread.posts[postId] = postId
    }
  }
})
