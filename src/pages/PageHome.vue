<template>
  <div class="col-full push-top">
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import {mapGetters} from 'vuex'

export default {
  components: {
    CategoryList
  },

  computed: {
    ...mapGetters([
      'categories'
    ])
  }
}
</script>
