<template>
  <div id="app">
    <TheNavbar/>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import TheNavbar from '@/components/TheNavbar'
  import { auth } from '@/main';
  
  export default {
    components: {
      TheNavbar
    },
    data(){
      return {
        auth
      }
    },
    mounted() {
      auth.onAuthStateChanged((usr) => {
        //if (usr) {
          const collections = ['Threads', 'Users', 'Categories', 'Posts', 'Forums'];
          for (const collection of collections) {
            this.$store.dispatch(`bind${collection}`);
          }
          this.$store.dispatch('setAuthUser')
        //}
      })
    }
  }
</script>

<style>
@import "assets/css/style.css";
</style>
