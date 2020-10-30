import { createStore } from 'vuex'
import sourceData from '@/data'

const store = createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },

  getters: {
    authUser (state) {
      return state.users.find(u => u.key === state.authId)
    },
    userPosts: (state) => {
      return state.posts.filter(p => p.userId === state.authId)
    },
    posts: (state) => state.posts
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