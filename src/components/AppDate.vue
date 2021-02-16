<template>
  <span :title="humanFriendlyDate">{{diffForHumans}}</span>
</template>

<script>
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    dayjs.extend(relativeTime)

    export default {
      props: {
        timestamp: {
          required: true,
          type: Number
        }
      },

      computed: {
        humanFriendlyDate () {
          return dayjs(this.timestamp).format('MMMM Do YYYY, h:mm:ss a')
        },

        diffForHumans () {
          return dayjs(this.timestamp * 1000).fromNow()
        }
      }
    }
</script>

<style scoped>

</style>
