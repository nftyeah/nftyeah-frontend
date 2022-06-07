<template>
  <div class="container">
    <img class="logo" src="@/assets/null.svg" alt="" />
    <span>{{ tips }}</span>
  </div>
</template>

<script>
  //
  export default {
    name: "indexNoItems",
    props:{
      tips: {
        type: String,
        default: null
      },
    },
  }
</script>

<style lang="sass" scoped>

  $Tahoma-Bold: Tahoma-Bold
  $Tahoma: Tahoma

.container
  margin: 0 auto
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
  .logo
    max-width: 246px
    width: 100%
    max-height: 186px
    height: 100%
  span
    margin-top: 30px
    margin-bottom: 30px
    font-family: $Tahoma
    font-weight: 400
    color: #DDDDDD
    font-size: 24px

</style>