<template>
  <div class="col-full push-top">
    <TmpCRUDFirebase/>
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import {mapGetters} from 'vuex'

import TmpCRUDFirebase from '@/components/TmpCRUDFirebase'

export default {
  components: {
    CategoryList,
    TmpCRUDFirebase
  },

  computed: {
    ...mapGetters([
      'categories'
    ])
  }
}
</script>
